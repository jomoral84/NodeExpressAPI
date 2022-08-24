/* eslint-disable */

const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const AppError = require('../controllers/errorController');

const router = express.Router();
router.use(authController.protect)

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin'))

router.route('/')
    .get(bookingController.getAllBooking)
    .post(bookingController.createBooking)

// router.route('/:id')
//     .get(bookingController.getOneBooking)
//     .patch(bookingController.updateBooking)
//     .delete(bookingController.deleteBooking)


module.exports = router;