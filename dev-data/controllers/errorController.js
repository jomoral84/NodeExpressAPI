module.exports = ((err, req, res, next) => { // Middleware global de manejo de errores

    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
})