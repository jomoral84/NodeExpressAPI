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


router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:id', viewController.getOneTourById);
//router.get('/tour/:id', viewController.getTour);

router.get('/login', viewController.getLoginForm);
router.get('/signUp', viewController.getSignUpForm);
router.get('/me', authController.protect, viewController.getAccount);

// router.post('/submit-user-data', authController.protect, viewController.updateUserData);



module.exports = router; // SE EXPORTA EL ROUTER