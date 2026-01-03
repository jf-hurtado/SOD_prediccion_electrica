// sever.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const orchestatorRoutes = require('./routes/orchestatorRoutes');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(helmet());
app.use(express.json());

app.use('/', orchestatorRoutes);

const startServer = async () => {
    try {        
        app.listen(PORT, () => {
            const serverURL = `http://localhost:${PORT}`;
            console.log(`[ORCHESTATOR] Servidor corriendo en ${serverURL}`);
        });  

    } catch(err) {
        console.error('[ORCHESTATOR] Error al inicializar el servidor', err);
        process.exit(1);
    }
}

startServer();


