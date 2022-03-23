const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({ // Esquema basico de mongoose
    name: {
        type: String,
        required: [true, "Debe tener un nombre"], // Valida los datos
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Debe tener un precio"]
    },
    rating: {
        type: Number,
        default: 4.5
    }
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;