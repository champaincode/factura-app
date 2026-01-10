require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/")));
app.use(bodyParser.json());

// Endpoint para obtener configuración segura (URL de Sheets)
app.get("/api/config", (req, res) => {
  res.json({
    sheetsWebAppUrl: process.env.SHEETS_WEB_APP_URL || "",
  });
});

// Proxy para la IA (Oculta la API Key)
app.post("/api/ai-magic", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Server missing API Key" });
    }

    // Llamada a Gemini desde el servidor
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Gemini API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ text: generatedText });
  } catch (error) {
    console.error("AI Proxy Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta principal para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
