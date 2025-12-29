// services/orchestrationService.js

const fetch = require('node-fetch'); 

const runOrchestration = async () => {
    try {
        // ACQUIRE
        console.log('[ORCHESTRATOR] Solicitando nuevos datos a ACQUIRE...');
        
        const acquireResponse = await fetch(`${process.env.ACQUIRE_SERVICE_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (!acquireResponse.ok) {
            throw new Error(`Servicio ACQUIRE respondió con error: ${acquireResponse.status}`);
        }

        const acquireData = await acquireResponse.json();
        console.log(`[ORCHESTRATOR] Datos recibidos de ACQUIRE. Data ID: ${acquireData.dataId}`);

        // PREDICT
        console.log('[ORCHESTRATOR] Solicitando predicción a PREDICT...');

        const predictBody = {
            features: acquireData.features,
            meta: {
                featureCount: acquireData.featureCount,
                dataId: acquireData.dataId,
                source: "orchestrator"
            }
        };

        const predictResponse = await fetch(`${process.env.PREDICT_SERVICE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(predictBody)
        });

        if (!predictResponse.ok) {
            throw new Error(`Servicio PREDICT respondió con error: ${predictResponse.status}`);
        }

        const predictData = await predictResponse.json();
        console.log(`[ORCHESTRATOR] Predicción recibida de PREDICT. Prediction ID: ${predictData.predictionId}`);

        // Respuesta final
        const finalResponse = {
            dataId: acquireData.dataId,
            predictionId: predictData.predictionId,
            prediction: predictData.prediction,
            timestamp: predictData.timestamp
        };

        return finalResponse;

    } catch (error) {
        console.error('[ORCHESTRATOR] Error en el flujo de orquestación:', error.message);
        throw error;
    }
};

module.exports = { runOrchestration };