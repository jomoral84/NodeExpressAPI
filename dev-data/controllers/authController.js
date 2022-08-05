/* eslint-disable */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const crypto = require('crypto');



const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};


exports.createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);

    const cookieOptions = { // Almacena el JWT en una HHTP Only cookie
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;



    res.cookie('jwt', token, cookieOptions);

    // Quita el password que aparece en postman
    user.password = undefined;


    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user
        }
    });
};




exports.signup = async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    });

    // createSendToken(newUser, 201, res);

    const token = signToken(newUser._id);

    const cookieOptions = { // Almacena el JWT en una HHTP Only cookie
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Quita el password que aparece en postman
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })

}


exports.login = async(req, res, next) => {
    const { email, password } = req.body;

    // 1) Chequea si los datos existen
    if (!email || !password) {
        return next(new AppError('Ingrese password y/o mail!', 400));
    }

    // 2) Chequea que el usuario exista y el password sea correcto
    const user = await User.findOne({ email }).select('+password');


    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Mail o password incorrectos!', 401));
    }


    console.log(user);

    // 3) Si la verificacion es ok se manda el token al cliente

    const token = signToken(user._id);

    const cookieOptions = { // Almacena el JWT en una HHTP Only cookie
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Quita el password que aparece en postman
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: user
        }
    })
}


exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};




exports.protect = catchAsync(async(req, res, next) => {

    // 1) Tomar el token 

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }



    // 2) Token de verificacion
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    // 3) Chequea que el usuario siga en una sesion

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('El usuario del token usado no existe!'));
    }

    // 4) Chequea si el usuario cambió de password despues de pedir el token
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('El usuario acaba de cambiar el password. Por favor realize el logueo nuevamente'));
    }


    // Acceso a la ruta protegida
    req.user = currentUser;
    res.locals.user = currentUser;
    next();


});


// Muestra las paginas cuando el usuario esta logeado
exports.isLoggedIn = async(req, res, next) => {

    // 1) Tomar el token 

    if (req.cookies.jwt) {
        try {


            // 2) Token de verificacion

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);


            // 3) Chequea que el usuario siga en una sesion

            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 4) Chequea si el usuario cambió de password despues de pedir el token

            if (currentUser.changePasswordAfter(decoded.iat)) {
                return next();
            }

            // Hay un usuario logeado
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};




exports.restrictTo = (...roles) => { // middleware function que restringe las acciones depende el rol del usuario
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('No tiene permisos para realizar la accion!', 403));
        }

        next();
    }
}


exports.forgotPassword = async(req, res, next) => { // Middleware para recuperar password 
    // 1) Buscar el usuario por medio del mail
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('No existe el usuario con ese mail!', 404));
    }

    // 2) Generar un token random
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Enviar el token al mail del usuario
    const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`; // URL que se enviara por mail para cambiar el password


    const message = `Olvido su password? Entre al siguiente link para obtener uno nuevo: ${resetURL}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Se ha enviado su token valido por 10 minutos!',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token enviado!'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('Hubo un error enviando el mensaje!', 500));

    }

}



exports.resetPassword = async(req, res, next) => {
    //  1) Obtener el usuario basado en el token
    const hashedtoken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedtoken, passwordResetExpires: { $gt: Date.now() } });

    // 2) Si el token no vencio setear el nuevo password
    if (!user) {
        return next(new AppError('Token invalido o expirado!', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt

    // 4) Logear al usuario, enviar el JWT
    // createSendToken(user, 200, res);

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    })


}


exports.updatePassword = async(req, res, next) => {
    // 1) Seleccionar usuario
    const user = await User.findById(req.user.id).select('+password');


    // 2) Chequear si el password es el correcto
    if (!(user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Password invalido!', 401));
    }




    // 3) Si es asi, actualizar el password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Logear al usuario, enviar el JWT
    //  createSendToken(user, 200, res);

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    })

}