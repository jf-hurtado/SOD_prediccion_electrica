// controllers/acquireController.js
const database = require('../services/database');
const { getDataKunna } = require('../services/kunnaDataAcquisition');

const health = (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'acquire'
    });
};

// Como no se pasa body no sé cual va a ser la fecha objetivo, es decir,
// si se va a poder pasar la fecha objetivo por parámetro para hacer la
// obtención de datos de un día concreto que no sea para hoy o mañana 
const data = async (req, res) => { 
    let targetDate;   
    let apiData;
    let savedData;

    try {
        console.log('[ACQUIRE] Accediendo a la API externa (kunna)')
        const result = await getDataKunna();
        apiData = result.apiData;
        targetDate = result.targetDate;

    } catch(err) {
        console.error('[ACQUIRE] Error al obtener datos de Kunna', err);
        return res.status(500).json({error: 'Error interno  al obtener los datos de kunna'});
    }

    try{
        savedData = await database.saveData(apiData, targetDate);
        console.log('[ACQUIRE] Datos guardados con éxito en la DB');
    } catch(err) {
        console.error('[ACQUIRE] Error al guardar los datos de kunna en la DB', err);
        return res.status(500).json({error: 'Error interno en el guardado de datos de kunna en la DB'})
    }

    res.status(201).json({
            "dataId": savedData._id,
            "features": savedData.features,
            "featureCount": savedData.featureCount,
            "scalerVersion": savedData.scalerVersion,
            "createdAt": savedData.createdAt
        });    
};


module.exports = { 
    health,
    data
}

