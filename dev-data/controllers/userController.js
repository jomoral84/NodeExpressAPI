const multer = require('multer');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const AppError = require('../utils/appError');




const multerStorage = multer.diskStorage({ // Ubicacion donde se van a guardar las imagenes de los usuarios
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('No es una imagen!', 400), false);
    }
}


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});


exports.uploadUserPhoto = upload.single('photo');




const filterObj = (obj, ...allowedFields) => { // Variable que filtra los campos que deben permancecer
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })

    return newObj;
}



exports.getAllUsers = async(req, res) => {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(User.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const users = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};


exports.updateMe = async(req, res, next) => {
    // 1) Crear error si el usuario postea informacion de su password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Esta ruta no es para cambio de password. Usar UpdateMypassword'), 400);

    }

    // 2) Filtra los campos que no deben ser modificados ejemplo: role
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) {
        filteredBody.photo = req.file.filename;
    }

    // 3) Update user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        status: 'success',
        message: 'Cambios aplicados',
        user: updatedUser
    });
}



exports.deleteMe = async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        message: 'Usuario Borrado',
        data: null
    });

}