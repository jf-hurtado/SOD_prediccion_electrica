// controllers/predictController.js
const database = require('../services/database'); 
const { getModelInfo, predict } = require("../services/tfModelService");

function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.modelVersion,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.modelVersion
  });
}

async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    const { features, meta } = req.body;

    if (!features) {
      return res.status(400).json({ error: "Missing features" });
    }
    if (!meta || typeof meta !== "object") {
      return res.status(400).json({ error: "Missing meta object" });
    }

    const { featureCount, dataId } = meta;

    if (featureCount !== info.inputDim) {
      return res.status(400).json({
        error: `featureCount must be ${info.inputDim}, received ${featureCount}`
      });
    }

    if (!Array.isArray(features) || features.length !== info.inputDim) {
      return res.status(400).json({
        error: `features must be an array of ${info.inputDim} numbers`
      });
    }

    const prediction = await predict(features);
    const latencyMs = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    // Estructura features
    // [consumo_t, consumo_t-1, consumo_t-2, hora, dia_semana, mes, dia_mes]
    const data = {
      features, 
      meta,
      prediction
    };
    const savedPrediction = await database.savePrediction(data); 

    // De momento sin MongoDB → predictionId null
    res.status(201).json({
      predictionId: savedPrediction._id,
      prediction,
      timestamp,
      latencyMs
    });
  } catch (err) {
    console.error("Error en /predict:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

async function getPredict(req, res) {
  const id = req.params.id 
  try{
    const prediction = await database.getPrediction(id);
    if (prediction === null){
      return res.status(404).json({error: `Error en la petición del cliente. No se encuentra ninguna predicción con el id ${id}`})
    } 
    res.status(200).json({prediction})

  } catch(err) {
    console.error(`Error en /predict/${id}`, err)
    res.status(500).json({error: 'Error interno del servidor'})
  }
}

module.exports = {
  health,
  ready,
  doPredict,
  getPredict
};
