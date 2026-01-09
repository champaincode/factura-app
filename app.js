const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos (imágenes, estilos, scripts)
app.use(express.static(path.join(__dirname, "/")));

// Ruta principal para servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
