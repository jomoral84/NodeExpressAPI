/* eslint-disable */

const AppError = require('../controllers/errorController');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const APIFeatures = require('../utils/apiFeatures');


exports.getCheckoutSession = catchAsync(async(req, res, next) => {
    // 1) Get the curently booked tour 

    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
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
                    images: [`http://www.natours.dev/img/tours/${tour.imageCover}`],
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


exports.createBookingCheckout = async(req, res, next) => {
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) {
        return next();
    }

    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
}


// exports.createBooking = factory.createOne(Booking);




// exports.getOneBooking = factory.getOne(Booking);
// exports.getAllBooking = factory.getAll(Booking);
// exports.updateBooking = factory.updateOne(Booking);
// exports.deleteBooking = factory.deleteOne(Booking);


exports.getAllBooking = async(req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Booking.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const booking = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: booking.length,
        data: {
            data: booking
        }
    });

    res.status(201).json({
        status: 'success',
        booking
    });
}


exports.createBooking = async(req, res, next) => {
    const booking = await Booking.create(req.body);

    res.status(201).json({
        status: 'success',
        booking
    });
}