// services/logger.js
const pino = require('pino');

// 1. Creamos UNA ÚNICA instancia del logger con toda la configuración.
const logger = pino({
    level: 'info',

    // Configuración para que pino-pretty se vea bien en desarrollo.
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        }
    }
});

// 2. Exportamos esa instancia directamente.
module.exports = logger;