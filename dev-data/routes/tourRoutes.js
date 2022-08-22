const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(authController.protect, tourController.createTour);

router
    .route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/tour-stats').get(tourController.getTourStats); // STATS
router
    .route('/getplan/:year').get(tourController.getPlan); // PLANES POR AÑO

router
    .route('/:id')
    .get(tourController.getOneTour)
    .patch(authController.protect, authController.restrictTo('admin'), tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour);

module.exports = router; // SE EXPORTA EL ROUTER