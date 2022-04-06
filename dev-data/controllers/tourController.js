const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name, price, ratingsAverage, difficulty, summary';
    next();

};



//     const tours = JSON.parse(
//     fs.readFileSync(require('path').resolve('dev-data/data/tours-simple.json')));  


// TOURS ROUTE HANDLERS

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);

//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res, next) => { // Middleware que chequea si el body contiene la propiedad nombre y precio
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();
// };

exports.getAllTours = async(req, res) => {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};


exports.getOneTour = async(req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}


exports.createTour = async(req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        //     const newId = tours[tours.length - 1].id + 1; // Toma el ultimo tour del array

        //     const newTour = Object.assign({ id: newId }, req.body);
        //     tours.push(newTour);

        //     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {


        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};


exports.updateTour = async(req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            status: 'success',
            data: {
                tour: '<Updated tour...>'
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}


exports.deleteTour = async(req, res) => {

    // if (req.params.id * 1 > tours.length) { // Valida si se supera el largo del array
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Id invalido'
    //     });
    // }

    // res.status(204).json({
    //     status: 'success',
    //     data: null
    // });

    try {
        const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

        res.status(200).json({
            status: 'success',
            data: {
                tour: '<Deleted tour...>'
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};