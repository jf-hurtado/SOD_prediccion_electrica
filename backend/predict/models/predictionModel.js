const mongoose = require('mongoose');
const { Schema } = mongoose;

const prediction = new Schema({
    // Estructura features
    // [consumo_t, consumo_t-1, consumo_t-2, hora, dia_semana, mes, dia_mes]
    features: {
        type: Array,
        required: true
    },
    meta: {
        type: Object,
        required: true
    },
    prediction: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Prediction = mongoose.model('Prediction', prediction);
module.exports = { Prediction };
