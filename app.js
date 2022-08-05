const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');



const errorController = require('./dev-data/controllers/errorController');



const tourRouter = require('./dev-data/routes/tourRoutes');
const userRouter = require('./dev-data/routes/userRoutes');
const viewRouter = require('./dev-data/routes/viewRoutes')
const AppError = require('./dev-data/utils/appError');
const globalErrorHandler = require('./dev-data/controllers/errorController');


const app = express();


app.set('view engine', 'pug'); // Motor de plantillas usado: PUG
//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({ // Delimitador de intentos de logeo a 10
    max: 10,
    windowsMs: 60 * 60 * 1000,
    message: 'Demasiados intentos desde la IP, pruebe dentro de 1 hora'
})

app.use('/api', limiter);
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                scriptSrc: [
                    "'self'",
                    'https:',
                    'http:',
                    'blob:',
                    'https://*.mapbox.com',
                    'https://leafletjs.com',
                    'https://js.stripe.com',
                    'https://m.stripe.network',
                    'https://*.cloudflare.com',
                ],
                frameSrc: ["'self'", 'https://js.stripe.com'],
                objectSrc: ["'none'"],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                workerSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://*.tiles.mapbox.com',
                    'https://api.mapbox.com',
                    'https://events.mapbox.com',
                    'https://m.stripe.network',
                ],
                childSrc: ["'self'", 'blob:'],
                imgSrc: ["'self'", 'data:', 'blob:'],
                formAction: ["'self'"],
                connectSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'data:',
                    'blob:',
                    'https://*.stripe.com',
                    'https://*.mapbox.com',
                    'https://leafletjs.com',
                    'https://*.cloudflare.com/',
                    'https://bundle.js:*',
                    'ws://localhost:*/',

                ],
                upgradeInsecureRequests: [],
            },
        },
    })
);


// Data sanitization contra NoSQL query injections
app.use(mongoSanitize());

// Data sanitization contra XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingAverage', 'maxGroupSize', 'difficulty', 'price']
}));



app.use(express.json({ limit: '10kb' })); // Middleware
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names

app.use(express.static(`${__dirname}/public/`)); // Permite acceder al html overview y tour
app.use(express.static(path.join(__dirname, 'public')));


// app.use((req, res, next) => { // Se define un middleware global antes de los route handlers
//     console.log("Hola desde el middleware");
//     next();
// })


app.use((req, res, next) => { // Se define un middleware para saber el horario del request
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
})



// MAIN ROUTERS

app.use('/', viewRouter);
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