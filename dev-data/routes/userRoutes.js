const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const upload = multer({ dest: 'public/img/users' }); // Ubicacion donde se van a guardar las imagenes de los usuarios
const router = express.Router();


router.post('/signup', authController.signup); // Route para signup
router.post('/login', authController.login); // Route para login
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


router
    .route('/')
    .get(userController.getAllUsers)
    // .post(userController.createUser);

// router
//     .route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser);

module.exports = router; // SE EXPORTA EL ROUTER