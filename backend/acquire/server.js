// sever.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const acquireRoutes = require('./routes/acquireRoutes');
const { connectDB } = require('./services/database');
const rootLogger = require('./services/logger');
const logger = rootLogger.child({service: 'acquire-server'});

const PORT = process.env.PORT || 3001;

const app = express();
app.use(helmet());
app.use(express.json());

app.use('/', acquireRoutes);

const startServer = async () => {
    try {
        try {
            await connectDB();
        } catch(err) {
            logger.error(err, 'ERROR al conectar la DB', err.message);
            process.exit(1);
        }
        
        app.listen(PORT, () => {
            const serverURL = `http://localhost:${PORT}`;
            logger.info(`Servidor corriendo en ${serverURL}`);
        });  

    } catch(err) {
        logger.error('Error al inicializar el servidor', err);
        process.exit(1);
    }
}

startServer();


