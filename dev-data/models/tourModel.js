const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({ // Esquema de mongoose
    name: {
        type: String,
        required: [true, "Debe tener un nombre"], // Validador de los datos
        unique: true,
        trim: true,
        maxlength: [40, "El tour no debe superar los 40 caracteres"], // Validador de largo
        minlength: [5, "El tour debe tener mas de 5 caracteres"]
    },

    slug: String,
    secretTour: {
        type: Boolean,
        default: false

    },

    duration: {
        type: Number,
        required: [true, "El tour debe tener una duracion"]
    },

    difficulty: {
        type: String,
        required: [true, "El tour debe tener una dificultad"],
        enum: {
            values: ['easy', 'medium', 'difficult'], // Valida la dificultad
            message: 'La dificultad debe ser: easy, medium, difficult'
        }
    },


    price: {
        type: Number,
        required: [true, "Debe tener un precio"]
    },

    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // La palabra this apunta al documento 
                return val < this.price;
            },
            message: 'El precio de descuento debe ser meor al precio normal'
        }
    },

    summary: {
        type: String,
        trim: true
    },


    rating: {
        type: Number,
        default: 4.5
    },

    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Debe ser mayor a 1.0'],
        max: [5, 'Debe ser menor a 5']
    },

    ratingQuantity: {
        type: Number,
        default: 0
    },

    imageCover: {
        type: String,
        required: [true, "Debe tener una imagen"]
    },

    images: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

    startDates: [Date]

})

tourSchema.virtual('durationWeeks').get(function() { // Virtual Property
    return this.duration / 7;
});


// Document Middleware
tourSchema.pre('save', function() {
    this.slug = slugify(this.name, { lower: true });
});



// Query Middleware

tourSchema.pre('find', function() {
    this.find({ secretTour: { $ne: true } })

})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;


// Agregation Middleware

tourSchema.pre('aggregate', function() {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})