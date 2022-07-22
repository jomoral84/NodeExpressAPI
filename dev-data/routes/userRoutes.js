const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/signup', authController.signup); // Route para signup
router.post('/login', authController.login); // Route para login
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router; // SE EXPORTA EL ROUTER