const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');
const { env } = require('../src/config');
const { verificarClaveAPI } = require('../src/middlewares/apiKeyConfig');
const PORT = env.PORT;

// Conectar a la base de datos
connection();

// Crear servidor de node
const app = express();

// Configurar el servidor
app.use(cors());
app.use(express.json()); // recibir datos con content-type: application/json
app.use(express.urlencoded({ extended: true })); // recibir datos con content-type: application/x-www-form-urlencoded

// Middleware para verificar la clave de API


// Rutas 
const rutas_articulos = require('./routes/articulo');

// Cargar las rutas después del middleware de verificación de clave de API
app.use('/api', verificarClaveAPI, rutas_articulos);

app.get("/health",(req, res)=>{
    return res.status(200).json({
        status: "ok",
        mensaje: "Servidor funcionando correctamente"
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}...`);
});