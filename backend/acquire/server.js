// sever.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const acquireRoutes = require('./routes/acquireRoutes');
const { connectDB } = require('./services/database');

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
            console.error('[ACQUIRE DB] ERROR al conectar la DB', err);
            process.exit(1);
        }
        
        app.listen(PORT, () => {
            const serverURL = `http://localhost:${PORT}`;
            console.log(`[ACQUIRE] Servidor corriendo en ${serverURL}`);
        });  

    } catch(err) {
        console.error('[ACQUIRE] Error al inicializar el servidor', err);
        process.exit(1);
    }
}

startServer();


