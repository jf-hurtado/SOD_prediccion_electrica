// controllers/acquireController.js
const database = require('../services/database');
const { getDataKunna } = require('../services/kunnaDataAcquisition');
const { z } = require('zod');

// Definimos el "contrato" para el body de la petición /data
const dataRequestSchema = z.object({
    // 'targetDate' es una propiedad opcional.
    targetDate: z.string()
        // Si existe, debe ser un string con formato de fecha y hora válido.
        .datetime({ message: "El formato de targetDate debe ser un string ISO 8601 (ej: YYYY-MM-DDTHH:mm:ssZ)" })
        // Hacemos que sea opcional, si no viene no hay error.
        .optional()
});

const calculateDefaultTargetDate = () => {
    const now = new Date();
    const options = { 
        timeZone: 'Europe/Madrid', 
        hour: '2-digit',       
        hour12: false          
    };
    
    const madridHourString = now.toLocaleString('es-ES', options);
    const madridHour = parseInt(madridHourString);

    let targetDate = new Date(now);
    if (madridHour >= 23){
        targetDate.setDate(now.getDate() + 1);
    }
    console.log(`[ACQUIRE] (Default) La fecha objetivo es ${targetDate.toLocaleDateString()}`);
    return targetDate; 
};

const health = (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'acquire'
    });
};

const data = async (req, res) => { 
    try {
        // 1. VALIDACIÓN con Zod
        const { targetDate: requestedDateString } = dataRequestSchema.parse(req.body);

        // 2. LÓGICA DE DECISIÓN DE FECHA
        let targetDate;
        if (requestedDateString) {
            console.log(`[ACQUIRE] Usando fecha objetivo proporcionada: ${requestedDateString}`);
            targetDate = new Date(requestedDateString);
        } else {
            console.log('[ACQUIRE] No se proporcionó fecha, calculando por defecto.');
            targetDate = calculateDefaultTargetDate();
        }

        // 3. LLAMADA A SERVICIOS (ahora en un único bloque try)
        console.log(`[ACQUIRE] Iniciando adquisición para: ${targetDate.toISOString()}`);
        const apiData = await getDataKunna(targetDate); // Pasamos la fecha al servicio
        
        console.log('[ACQUIRE] Datos de Kunna obtenidos, guardando en DB...');
        const savedData = await database.saveData(apiData, targetDate);
        
        console.log('[ACQUIRE] Datos guardados con éxito.');

        // 4. RESPUESTA DE ÉXITO
        res.status(201).json({
            "dataId": savedData._id,
            "features": savedData.features,
            "featureCount": savedData.featureCount,
            "scalerVersion": savedData.scalerVersion,
            "createdAt": savedData.createdAt
        });    

    } catch(err) {
        // 5. MANEJO CENTRALIZADO DE ERRORES
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: 'Petición inválida.', errors: err.errors });
        }
        console.error('[ACQUIRE] Proceso fallido:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = { 
    health,
    data
}

