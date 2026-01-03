// sever.js
require('dotenv').config();

const express = require('express');
const orchestatorRoutes = require('./routes/orchestatorRoutes');
const rootLogger = require('./services/logger.js');
const logger = rootLogger.child({service: 'orchestrator-server'});

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use('/', orchestatorRoutes);

const startServer = async () => {
    try {        
        app.listen(PORT, () => {
            const serverURL = `http://localhost:${PORT}`;
            logger.info(`Servidor corriendo en ${serverURL}`);
        });  

    } catch(err) {
        logger.error(err, 'Error al inicializar el servidor', err.message);
        process.exit(1);
    }
}

startServer();


