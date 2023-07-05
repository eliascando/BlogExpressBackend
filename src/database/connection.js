const mongoose = require('mongoose');
const {env} = require('../config')


const connection = async () => {
    try{
        await mongoose.connect(env.MONGODB_URL);
        console.log('Base de datos conectada!');

    }catch(error){
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }
};

module.exports = { 
    connection 
};