// services/database.js
const mongoose = require('mongoose');
const Data = require('../models/dataModel');

const connectDB = async () => {
    const connection_string = process.env.MONGO_URI;
    await mongoose.connect(`${connection_string}`);
    console.log(`[ACQUIRE DB] Conexion exitosa con la DB en ${connection_string}`)
};

const formatData = (data, targetDate) => {

    if (!data.result || !Array.isArray(data.result.values) || data.result.values.length === 0 || data.result.values[0].length === 0) {
        throw new Error("La respuesta de la API externa no contiene datos de consumo válidos.");
    }

    const values = data.result.values;

    // Consumos
    const dailyValues = values.map(dayData => dayData[2])
    // Fechas
    const dateObjects = values.map(dayData => new Date(dayData[0]));
    // Dia del mes    
    const daysUsed = dateObjects.map(date => date.getDate());
    // Metadatos
    const alias = values[0][5];
    const name = values[0][11];

    // Fecha objetivo
    const targetHour = parseInt(targetDate.toTimeString().split(':')[0]);
    const targetWeekDay = targetDate.getDay();
    const targetMonth = targetDate.getMonth() + 1;
    const targetDay = targetDate.getDate();

    // Consumos para predict
    const consumptionFeatures = [
        dailyValues[0] || 0, // Si no existe, usa 0
        dailyValues[1] || 0, // Si no existe, usa 0
        dailyValues[2] || 0  // Si no existe, usa 0
    ];

    // Fechas para predict
    const dateFeatures = [
        targetHour,
        targetWeekDay,
        targetMonth,
        targetDay
    ];

    // Features
    const features = [consumptionFeatures, dateFeatures]

    const formatedData = {
        features: features,
        featureCount: features.length,
        scalerVersion: "v1",
        createdAt: new Date().toISOString(), 
        targetDate: targetDate,
        dailyValues: dailyValues, 
        kunnaMeta: {
            alias: alias,
            name: name,
            daysUsed: daysUsed 
        },
        fetchMeta: {
            timeStart: values[values.length - 1][0], 
            timeEnd: values[0][0]    
        },
        source: "acquire"
    };

    return formatedData;
}

const saveData = async (data, targetDate) => {

    const formatedData = formatData(data, targetDate);

    const newData = new Data(formatedData);
    const saved = await newData.save();
    return saved;
};

const getData = async (id) => {
    const data = await Data.findById(id);
    return data;
};

module.exports = {
    connectDB,
    saveData,
    getData
};

