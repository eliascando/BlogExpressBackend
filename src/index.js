const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');

//Iniciar la app
console.log("Inicio de la aplicación")

//Conectar a la base de datos
connection();

//Crear servidor de node
const app = express();

//Configurar el servidor
app.use(cors());
app.use(express.json()); //recibir datos con content-type: application/json
app.use(express.urlencoded({ extended: true })); //recibir datos con content-type: application/x-www-form-urlencoded

//Definir el puerto
const PORT = 5000;

//Rutas 
const rutas_articulos = require('./routes/articulo');

//Cargar las rutas
app.use('/api', rutas_articulos);


app.get("/",(req, res)=>{
    res.send("<h1>Hola mundo desde el servidor de NodeJS</h1>");
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
});