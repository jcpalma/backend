import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// import path from 'path';

import appRouter, { ignoreFavicon } from './routes/index';
import userRouter from './routes/user';
import loginRouter from './routes/login';

// * Creación de la aplicación de Express 
const app = express();


// * Settings  
app.set('port', process.env.BACKEND_PORT || 3000);


// * Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencode
app.use(bodyParser.json()); // parse application/json
app.use(ignoreFavicon);

// * Rutas
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/', appRouter);

// Carpetas estaticas
// app.use('/public', express.static(path.resolve('public')));


export default app;