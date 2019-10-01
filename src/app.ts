import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';

import indexRoute from './routes/index'

// * Creación de la aplicación de Express 
const app = express();


// * Settings  
app.set('port', process.env.BACKEND_PORT || 3000);

// * Middleware
app.use(morgan('dev'));
app.use(express.json);

// * Rutas
app.use('/api/v1', indexRoute);

// Carpetas estaticas
// app.use('/public', express.static(path.resolve('public')));


export default app;