/* eslint-disable */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt
    });

    const token = signToken(newUser._id);

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

    res.status(201).json({
        status: 'success',
        token
    })

}



exports.protect = catchAsync(async(req, res, next) => {

    // 1) Tomar el token 

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
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
    next();


});