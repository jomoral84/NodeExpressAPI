const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/pruebapug', (req, res) => { // Prueba template PUG
    res.status(200).render('base', {
        tour: 'Las minas de San Ignacio',
        user: 'Beto',
        price: 200
    });
})

router.get('/', viewController.getOverview);
router.get('/tour/:id', viewController.getOneTourById);




module.exports = router; // SE EXPORTA EL ROUTER