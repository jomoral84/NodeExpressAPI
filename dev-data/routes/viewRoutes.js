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

router.get('/overview', viewController.getOverview);
router.get('/tour', viewController.getTour);


router.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'El Bosque'

    })
})

module.exports = router; // SE EXPORTA EL ROUTER