const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


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

    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'advancedUser', 'admin'],
        default: 'user'
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true
    }
})




userSchema.pre('save', async function(next) { // Forma de encriptar un password
    if (!this.isModified('password')) { // Funcion que se ejecuta si el password fue modificado
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
});


userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


userSchema.pre(/^find/, function(next) { // Query middleware que muestra solo los usuarios activos
    this.find({ active: { $ne: false } })
    next();
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) { // Funcion que compara el password ingresado con el encriptado
    return await bcrypt.compare(candidatePassword, userPassword);
}


userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimeStamp;

    }
    return false;
}


userSchema.methods.createPasswordResetToken = function() { // Metodo para crear y encriptar un token aleatorio

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;