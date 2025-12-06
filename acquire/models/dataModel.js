// models/dataModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const data = new Schema ({
    features: [
        Number,
        Number,
        Number,
        Number,
        Number,
        Number,
        Number
    ],
    featureCount: Number,
    scalerVersion: String,
    createdAt: Date,
    targetDate: Date,
    dailyValues: [
        Number,
        Number,
        Number
    ],
    kunnaMeta: {
        alias: String,
        name: String,
        daysUsed: [
            Date,
            Date,
            Date
        ]
    },
    fetchMeta: {
        timeStart: Date,
        timeEnd: Date    
    },
    source: String
});

module.exports = mongoose.model('Data', data);
