const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID); // PARAM MIDDLEWARE



// router.param('id', tourController.checkID);




router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/tour-stats').get(tourController.getTourStats); // STATS
router
    .route('/getplan/:year').get(tourController.getPlan); // PLANES POR AÑO

router
    .route('/:id')
    .get(tourController.getOneTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router; // SE EXPORTA EL ROUTER