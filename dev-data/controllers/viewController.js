const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');



exports.getOverview = async(req, res) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Todos Los Tours',
        tours: tours
    })

}


exports.getTour = async(req, res) => {

    // 1) Get the data, for the requested tour (including reviews and guides)

    // const tour = await Tour.findOne({ slug: req.params.slug }, (error, post) => {
    //     console.log(error, post)
    // });

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        field: 'reviews rating user'
    });

    if (!tour) {
        return (new AppError('No existe Tour con ese nombre', 404));
    }

    res.status(200).render('tour', {
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


exports.getLoginForm = async(req, res) => {

    res.status(200).render('login', {
        title: 'Ingrese su usuario'
    })
}

exports.getSignUpForm = async(req, res) => {

    res.status(200).render('signUp', {
        title: 'Creacion de Cuenta'
    })
}


exports.getAccount = async(req, res) => {
    res.status(200).render('account', {
        title: 'Datos de usuario'
    })
}


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