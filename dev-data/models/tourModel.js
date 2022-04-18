const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({ // Esquema basico de mongoose
    name: {
        type: String,
        required: [true, "Debe tener un nombre"], // Valida los datos
        unique: true,
        trim: true
    },

    slug: String,

    duration: {
        type: Number,
        required: [true, "El tour debe tener una duracion"]
    },

    difficulty: {
        type: String,
        required: [true, "El tour debe tener una dificultad"]
    },


    price: {
        type: Number,
        required: [true, "Debe tener un precio"]
    },

    priceDiscount: Number,

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
        default: 4.5
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;