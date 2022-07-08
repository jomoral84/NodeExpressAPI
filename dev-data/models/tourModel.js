const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({ // Esquema de mongoose

    slug: String,

    name: {
        type: String,
        required: [true, "Debe tener un nombre"], // Validador de los datos
        unique: true,
        trim: true,
        maxlength: [40, "El tour no debe superar los 40 caracteres"], // Validador de largo
        minlength: [5, "El tour debe tener mas de 5 caracteres"]
    },



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

    startDates: [Date],

    startLocation: {
        //GeoJSON (type: and coordinates:)
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    //child referencing schema--contains array of ids
    locations: [{
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
    }, ],
    // guides: Array,
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }, ],
}, {
    toJSON: { virtuals: true },
    toOject: { virtuals: true },
});


tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });


// Virtual Properties

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});


// Document Middleware
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});



// Query Middleware

tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } })
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });
    next();
});


// Agregation Middleware

tourSchema.pre('aggregate', function() {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})




const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;