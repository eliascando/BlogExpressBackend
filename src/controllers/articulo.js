const fs = require('fs');
const path = require('path');
const { validarArticulo } = require('../helpers/validar');
const Articulo = require('../models/Articulo');

const crear = async (req, res) => {
    // Recoger parámetros por post a guardar
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(res, parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Crear el objeto a guardar
    const { titulo, contenido, resumen } = parametros;
    const articulo = new Articulo({
        titulo,
        contenido,
        resumen,
        fecha: new Date(),
        imagen: "default.png"
    });

    try {
        // Guardar el objeto en la base de datos
        const articuloGuardado = await articulo.save();

        // Devolver el resultado con el objeto completo y su ID
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo guardado correctamente"
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al guardar el artículo"
        });
    }
};


const listar = async (req, res) => {
    try {
        const articulos = await Articulo.find({}).sort({ fecha: -1 }).exec();
        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos",
            });
        } else {
            const articulosFormateados = articulos.map((articulo) => ({
                _id: articulo._id,
                titulo: articulo.titulo,
                resumen: articulo.resumen,
                contenido: articulo.contenido,
                fecha: articulo.fecha,
                imagen: articulo.imagen,
            }));

            return res.status(200).json({
                status: "success",
                contador: articulosFormateados.length,
                articulos: articulosFormateados,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener los artículos",
        });
    }
};


const uno = async (req, res) => {
    // Recoger el id de la url
    let id = req.params.id;

    // Buscar el articulo
    try {
        let articulo = await Articulo.findById(id).exec();

        // Comprobar que existe
        if (!articulo) {
            // Si no existe, devolver un error
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo"
            });
        } else {
            // Si existe, devolver el resultado con el campo "resumen" incluido
            return res.status(200).json({
                status: "success",
                articulo: {
                    _id: articulo._id,
                    titulo: articulo.titulo,
                    resumen: articulo.resumen,
                    contenido: articulo.contenido,
                    fecha: articulo.fecha,
                    imagen: articulo.imagen,
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener el artículo"
        });
    }
};


const borrar = async (req, res) => {
    //Recoger el id de la url
    let id = req.params.id;

    //Buscar el articulo
    try{
        let articulo = await Articulo.findByIdAndDelete(id).exec();

        //Comprobar que existe
        if(!articulo){
            //Si no existe, devolver un error
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el articulo"
            })
        }else{
            //Si existe, devolver el resultado
            return res.status(200).json({
                status: "success",
                articulo
            })
        }
    }catch(error){
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener el articulo"
        })
    }
};

const actualizar = async (req, res) => {
    // Recoger el id de la url
    let id = req.params.id;

    // Recoger los datos que llegan por put
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(res, parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Buscar y actualizar el articulo
    try {
        // Buscar el articulo
        let articulo = await Articulo.findOneAndUpdate({ _id: id }, parametros, { new: true }).exec();

        // Comprobar que existe
        if (!articulo) {
            // Si no existe, devolver un error
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo"
            });
        } else {
            // Si existe, devolver el resultado con el campo "resumen" incluido
            return res.status(200).json({
                status: "success",
                articulo: {
                    _id: articulo._id,
                    titulo: articulo.titulo,
                    resumen: articulo.resumen,
                    contenido: articulo.contenido,
                    fecha: articulo.fecha,
                    imagen: articulo.imagen,
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el artículo"
        });
    }
};

const subir = async(req, res) => {
    if(!req.file){
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha subido ningun archivo"
        });
    };

    //Nombre del archivo
    let nombre = req.file.originalname;

    //Extensión del archivo
    let extension = nombre.split('\.')[1];

    //Comprobar la extensión, solo imagenes
    if(extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){
        //Si no es valido, borrar el fichero
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "La extensión del archivo no es válida"
            });
        });
    }else{
        //Recoger el id de la url
        let id = req.params.id;
        try{
            //Buscar el articulo
            let articulo = await Articulo.findOneAndUpdate({_id: id}, {imagen: req.file.filename}, {new: true}).exec();
    
            //Comprobar que existe
            if(!articulo){
                //Si no existe, devolver un error
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontró el articulo"
                })
            }else{
                //Si existe, devolver el resultado
                return res.status(200).json({
                    status: "success",
                    articulo
                })
            }
        }catch(error){
            return res.status(500).json({
                status: "error",
                mensaje: "Error al obtener el articulo"
            })
        }
    }
};

const imagen = async(req, res) => {
    let fichero = req.params.imagen;
    let ruta_fichero = './imagenes/articulos/' + fichero;

    fs.stat(ruta_fichero, (error, existe) =>{
        if(existe){
            return res.sendFile(path.resolve(ruta_fichero));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró la imagen",
                existe,
                fichero,
                ruta_fichero
            });
        }
    });
}

const buscar = async (req, res) => {
    // Sacar el string de búsqueda
    let busqueda = req.params.busqueda;

    // Find OR
    let articulos = await Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } },
            { "resumen": { "$regex": busqueda, "$options": "i" } }
        ]
    }).sort([['fecha', 'descending']]).exec();

    // Devolver el resultado con el campo "resumen" incluido
    if (!articulos || articulos.length <= 0) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se encontraron artículos"
        });
    } else {
        // Mapear los artículos y devolver solo los campos necesarios
        const resultados = articulos.map(articulo => ({
            _id: articulo._id,
            titulo: articulo.titulo,
            resumen: articulo.resumen,
            contenido: articulo.contenido,
            fecha: articulo.fecha,
            imagen: articulo.imagen
        }));

        return res.status(200).json({
            status: "success",
            articulos: resultados
        });
    }
};

module.exports = {
    crear,
    listar,
    uno,
    borrar,
    actualizar,
    subir,
    imagen,
    buscar
};