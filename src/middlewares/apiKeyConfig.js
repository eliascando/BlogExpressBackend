const { env } = require("../config");
const API_KEY = env.API_KEY;

const verificarClaveAPI = (req, res, next) => {
    // Suponiendo que se envía la clave de API en el encabezado 'apikey'
    const claveAPI = req.headers['apikey'];
  
    // Verificar si la clave de API es válida
    ruta = req.originalUrl;
    
    if (claveAPI === API_KEY || ruta.startsWith('/api/imagen')) {
      next();
    }else {
      return res.status(401).json({
        status : 'unauthorized',
        mensaje: 'Clave de API inválida'
      });
    }
};

module.exports = {
    verificarClaveAPI
}