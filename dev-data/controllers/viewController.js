/* eslint-disable */

const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');



exports.getOverview = async(req, res) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Todos Los Tours',
        tours: tours
    })

}


exports.getTour = async(req, res) => {

    // 1) Get the data, for the requested tour (including reviews and guides)

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        field: 'reviews rating user'
    });


    res.status(200).set(
        'Content-Security-Policy',
        "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    ).render('tour', {
        title: 'Tour',
        tour
    });

}


exports.getOneTourById = async(req, res) => {

    const tour = await Tour.findById({ _id: req.params.id });

    if (!tour) {
        return (new AppError('No existe Tour con ese nombre', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });

}


exports.getLoginForm = catchAsync(async(req, res) => {

    res.status(200).render('login', {
        title: 'Ingrese su usuario'
    })
})

exports.getSignUpForm = catchAsync(async(req, res) => {

    res.status(201).render('signup', {
        title: 'Creacion de Cuenta'
    })
})


exports.getAccount = async(req, res) => {
    res.status(200).render('account', {
        title: 'Datos de usuario'
    })
}


exports.getMyTours = catchAsync(async(req, res, next) => {

    // 1) Find all bookings
    const booking = await Booking.find({ user: req.user.id })

    // 2) Find tours with the returned Id
    const tourIDs = booking.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } }) // Selecciona todos los tours que tiene un Id que se encuentra ($in) en el tourIds array

    res.status(200).render('overview', {
        title: 'Mis Tours',
        tours
    })
})


// exports.updateUserData = async(req, res) => {
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, {
//         name: req.body.name,
//         email: req.body.email
//     }, {
//         new: true,
//         runValidators: true
//     });

//     res.status(200).render('account', {
//         title: 'Modificacion Exitosa!',
//         user: updatedUser
//     })
// }