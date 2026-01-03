const mongoose = require('mongoose');
const { Prediction } = require('../models/predictionModel.js');
const rootLogger = require('./logger.js');
const logger = rootLogger.child({service: 'predict-database'})

//import mongoose from 'mongoose';
//import Prediction from '../models/predictionModel.js'; 

const connectDB = async () => {
    try {
        const mongo_uri = process.env.MONGO_URI;
        await mongoose.connect(`${mongo_uri}`)
        logger.info(`Conexion exitosa con la DB: ${mongo_uri}`);
    } catch(err) {
        logger.error(err, 'Error conectando la DB', err.message);
        process.exit(1);
    }
};

const savePrediction = async (data) => {
    try{
        // Objeto 'genérico' que creamos
        const newPrediction = new Prediction(data);

        // Objeto que me devuelve la DB trás haberlo guardado
        const saved = await newPrediction.save();

        logger.info(`Prediccion guardada con exito en la DB`, saved._id);
        return saved;
    } catch(err) {
        logger.error(err, 'Error al guardar la prediccion', err.message);
        throw err;
    }
};

const getPrediction = async (id) => {
    try{
        const prediction = await Prediction.findById(id);
        return prediction;
        
    } catch(err) {
        logger.info('ERROR obteniendo prediccion', err);
        throw err;
    }
}

module.exports = { 
    connectDB, 
    savePrediction,
    getPrediction
};