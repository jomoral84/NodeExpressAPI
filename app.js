const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const csp = require('express-csp');
const compression = require('compression');
const cors = require('cors');

const errorController = require('./dev-data/controllers/errorController');
const tourRouter = require('./dev-data/routes/tourRoutes');
const userRouter = require('./dev-data/routes/userRoutes');
const viewRouter = require('./dev-data/routes/viewRoutes');
const bookingRouter = require('./dev-data/routes/bookingRoutes');
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

app.use(cors()); // Cross-Origin Resource Sharing

app.options('*', cors());

app.use(helmet({ crossOriginEmbedderPolicy: false }));

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://*.cloudflare.com',
    'https://js.stripe.com/v3/',
    'https://checkout.stripe.com'
];
const styleSrcUrls = [
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://www.myfonts.com/fonts/radomir-tinkov/gilroy/*',
    ' checkout.stripe.com'
];
const connectSrcUrls = [
    'https://*.mapbox.com/',
    'https://*.cloudflare.com',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:52191',
    '*.stripe.com'

];

const fontSrcUrls = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:'],
            fontSrc: ["'self'", ...fontSrcUrls],
            frameSrc: ['*.stripe.com',
                '*.stripe.network'
            ]
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
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names

app.use(express.static(`${__dirname}/public/`)); // Permite acceder al html overview y tour
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression())

app.use((req, res, next) => { // Se define un middleware para saber el horario del request
    req.requestTime = new Date().toISOString();
    //  console.log(req.headers);
    next();
})


// MAIN ROUTERS

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
//app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => { // Middleware que maneja el error de ruta

    // const err = new Error(`No se puede encontrar la pagina: ${req.originalUrl}`)
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`No se puede encontrar la pagina: ${req.originalUrl}`, 404));
});


app.use(globalErrorHandler);


module.exports = app;