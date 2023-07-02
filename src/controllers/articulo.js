const fs = require('fs');
const path = require('path');
const { validarArticulo } = require('../helpers/validar');
const Articulo = require('../models/Articulo');

const crear = (req, res) => {
    //Recoger parametros por post a guardar
    let parametros = req.body;

    //Validar datos
    try{
        validarArticulo(res, parametros);
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    //Asignar valores al objeto basado en el modelo
    let resultado = articulo.save()

    if(!resultado){
        return res.status(400).json({
            status: "error",
            mensaje: "Error al guardar el articulo"
        })
    }else{
        //Devolver el resultado
        return res.status(200).json({
            status: "success",
            articulo: parametros,
            mensaje: "Articulo guardado correctamente"
        })
    }
};

const listar = async (req, res) => {
    try {
      const articulos = await Articulo.find({}).sort({fecha: -1}).exec();
      if (!articulos || articulos.length === 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se encontraron artículos",
        });
      } else {
        return res.status(200).json({
          status: "success",
          contador: articulos.length,
          articulos,
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
    //Recoger el id de la url
    let id = req.params.id;

    //Buscar el articulo
    try{
        let articulo = await Articulo.findById(id).exec();

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
    //Recoger el id de la url
    let id = req.params.id;

    //Recoger los datos que llegan por put
    let parametros = req.body;

    //Validar datos
    try{
        validarArticulo(res, parametros);
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Buscar y actualizar el articulo
    try{
        //Buscar el articulo
        let articulo = await Articulo.findOneAndUpdate({_id: id}, parametros, {new: true}).exec();

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

const buscar = async(req, res) => {
    //sacar el string de busqueda
    let busqueda = req.params.busqueda;

    //find OR

    let articulos = await Articulo.find({ "$or": [
        {"titulo": {"$regex": busqueda, "$options": " i"}},
        {"contenido": {"$regex": busqueda, "$options": " i"}}
    ]}).sort([['fecha', 'descending']]).exec();

    //devolver el resultado
    if(!articulos || articulos.length <= 0){
        return res.status(404).json({
            status: "error",
            mensaje: "No se encontraron articulos"
        });
    }else{
        return res.status(200).json({
            status: "success",
            articulos
        });
    }
}
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