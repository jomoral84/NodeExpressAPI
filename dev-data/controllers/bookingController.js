/* eslint-disable */

const AppError = require('../controllers/errorController');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);


exports.getCheckoutSession = catchAsync(async(req, res, next) => {
    // 1) Get the curently booked tour 

    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            quantity: 1,
            price_data: {
                currency: 'usd',
                unit_amount: tour.price,
                product_data: {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                },
            },
        }, ],


    });

    // 3) Create session as response

    res.status(201).json({
        status: 'success',
        session
    })
})