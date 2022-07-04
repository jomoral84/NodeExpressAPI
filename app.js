const path = require('path');
const express = require('express');
const morgan = require('morgan');
const errorController = require('./dev-data/controllers/errorController');

const tourRouter = require('./dev-data/routes/tourRoutes');
const userRouter = require('./dev-data/routes/userRoutes');
const AppError = require('./dev-data/utils/appError');
const globalErrorHandler = require('./dev-data/controllers/errorController')

const app = express();


app.set('view engine', 'pug'); // Motor de plantillas usado: PUG
app.set('views', path.join(__dirname, 'views'));



// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json()); // Middleware
app.use(express.static(`${__dirname}/public/`)); // Permite acceder al html overview y tour
app.use(express.static(path.join(__dirname, 'public')));


// app.use((req, res, next) => { // Se define un middleware global antes de los route handlers
//     console.log("Hola desde el middleware");
//     next();
// })


app.use((req, res, next) => { // Se define un middleware para saber el horario del request
    req.requestTime = new Date().toISOString();
    next();
})



// ROUTERS

app.get('/api/v1/pruebapug', (req, res) => { // Prueba template PUG
    res.status(200).render('base', {
        tour: 'Las minas de San Ignacio',
        user: 'Beto',
        price: 200
    });
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => { // Middleware que maneja el error de ruta

    // const err = new Error(`No se puede encontrar la pagina: ${req.originalUrl}`)
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`No se puede encontrar la pagina: ${req.originalUrl}`, 404));




});


app.use(globalErrorHandler);


module.exports = app;