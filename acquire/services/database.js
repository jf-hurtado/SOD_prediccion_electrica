// services/database.js
const mongoose = require('mongoose');
const Data = require('../models/dataModel');

const connectDB = async () => {
    const connection_string = process.env.MONGO_URI;
    await mongoose.connect(`${connection_string}`);
    console.log(`[ACQUIRE DB] Conexion exitosa con la DB en ${connection_string}`)
};

const formatData = (data, targetDate) => {
    const consumo_t0 = data.result.values[0][2];
    const consumo_t1 = data.result.values[1][2];
    const consumo_t2 = data.result.values[2][2];

    const currentDate = new Date();
    const createdAt = currentDate.toISOString();

    const targetHour = targetDate.toTimeString().split(':')[0];
    const targetWeekDay = targetDate.getDay();
    const targetMonth = targetDate.getMonth() + 1;
    const targetDay = targetDate.getDate();

    const alias = data.result.values[0][5];
    const name = data.result.values[0][11];

    const day0Date = new Date(data.result.values[0][0]);
    const day1Date = new Date(data.result.values[1][0]);
    const day2Date = new Date(data.result.values[2][0]);

    const day0 = day0Date.getDate();
    const day1 = day1Date.getDate();
    const day2 = day2Date.getDate();

    const startDate = data.result.values[2][0];
    const endDate = data.result.values[0][0];

    const formatedData = {
        features: [
            consumo_t0,
            consumo_t1,
            consumo_t2,
            targetHour,
            targetWeekDay,
            targetMonth,
            targetDay
        ],
        featureCount: 7,
        scalerVersion: "v1",
        createdAt: createdAt,
        targetDate: targetDate,
        dailyValues: [
            consumo_t0,
            consumo_t1,
            consumo_t2
        ],
        kunnaMeta: {
            alias: alias,
            name: name,
            daysUsed: [
                day0,
                day1,
                day2
            ]
        },
        fetchMeta: {
            timeStart: startDate,
            timeEnd: endDate    
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

