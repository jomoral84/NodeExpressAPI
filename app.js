const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./dev-data/routes/tourRoutes');
const userRouter = require('./dev-data/routes/userRoutes');

const app = express();



// MIDDLEWARES

app.use(express.json()); // Middleware
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public/`)); // Permite acceder al html overview y tour


app.use((req, res, next) => { // Se define un middleware global antes de los route handlers
    console.log("Hola desde el middleware");
    next();
})


app.use((req, res, next) => { // Se define un middleware para saber el horario del request
    req.requestTime = new Date().toISOString();
    next();
})



// ROUTERS

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;