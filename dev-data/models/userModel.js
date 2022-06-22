const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({ // Esquema de mongoose
    name: {
        type: String,
        required: [true, "Debe tener un nombre"], // Validador de los datos
        trim: true,
        maxlength: [40, "El nombre no debe superar los 40 caracteres"], // Validador de largo
        minlength: [4, "El nombre debe tener mas de 4 caracteres"]
    },


    email: {
        type: String,
        required: [true, "El usuario debe tener un mail"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Ingrese un email valido'] // Se uso una libreria "validator" para realizar la validacion
    },


    password: {
        type: String,
        required: [true, "El usuario debe tener un password"],
        minlength: 8,

    },

    passwordConfirm: {
        type: String,
        required: [true, "Confirme el ´password"],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Los passwords no coinciden!'
        }
    },

    photo: [String],
})




userSchema.pre('save', async function(next) { // Forma de encriptar un password
    if (!this.isModified('password')) { // Funcion que se ejecuta si el password fue modificado
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;