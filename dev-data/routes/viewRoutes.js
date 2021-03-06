const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/pruebapug', (req, res) => { // Prueba template PUG
    res.status(200).render('base', {
        tour: 'Las minas de San Ignacio',
        user: 'Beto',
        price: 200
    });
})

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:id', viewController.getOneTourById);
router.get('/login', viewController.getLoginForm)



module.exports = router; // SE EXPORTA EL ROUTER