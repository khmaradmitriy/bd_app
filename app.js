require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const pino = require('pino');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const priceRoutes = require('./routes/priceRoute')


const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Middleware логгера
app.use(pinoHttp({ logger }));
app.use(cookieParser());


// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/price',priceRoutes)

module.exports = app;
