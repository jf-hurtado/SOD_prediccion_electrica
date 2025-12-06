const mongoose = require('mongoose');
const { Prediction } = require('../models/predictionModel.js');

//import mongoose from 'mongoose';
//import Prediction from '../models/predictionModel.js'; 

const connectDB = async () => {
    try {
        const mongo_uri = process.env.MONGO_URI;
        await mongoose.connect(`${mongo_uri}`)
        console.log(`[DB] Conexion exitosa con la DB: ${mongo_uri}`);
    } catch(err) {
        console.log('[DB] Error conectando la DB', err);
        process.exit(1);
    }
};

const savePrediction = async (data) => {
    try{
        // Objeto 'genérico' que creamos
        const newPrediction = new Prediction(data);

        // Objeto que me devuelve la DB trás haberlo guardado
        const saved = await newPrediction.save();

        console.log(`[DB] Prediccion guardada con exito en la DB`, saved._id);
        return saved;
    } catch(err) {
        console.log('[DB] ERROR al guardar la prediccion', err);
        throw err;
    }
};

const getPrediction = async (id) => {
    try{
        const prediction = await Prediction.findById(id);
        return prediction;
        
    } catch(err) {
        console.log('[DB] ERROR obteniendo prediccion', err);
        throw err;
    }
}

module.exports = { 
    connectDB, 
    savePrediction,
    getPrediction
};