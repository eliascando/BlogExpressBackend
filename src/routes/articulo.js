const { Router } = require('express');
const multer = require('multer');
const router = Router();
const ArticuloController = require('../controllers/articulo');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/articulos');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});
const subidas = multer({storage: storage});

//Rutas
router.post("/crear",ArticuloController.crear);
router.get("/articulos/",ArticuloController.listar);
router.get("/articulo/:id",ArticuloController.uno);
router.delete("/articulo/:id",ArticuloController.borrar);
router.put("/articulo/:id",ArticuloController.actualizar);
router.post("/subir-imagen/:id", [subidas.single("file")],ArticuloController.subir);
router.get("/imagen/:imagen",ArticuloController.imagen);
router.get("/buscar/:busqueda",ArticuloController.buscar);

module.exports = router;