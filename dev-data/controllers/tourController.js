const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(require('path').resolve('dev-data/data/tours-simple.json')));

// TOURS ROUTE HANDLERS

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }
    next();
};

exports.getAllTours = (req, res) => {

    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        time: req.requestTime,
        data: {
            tours
        }
    });
};

exports.getOneTour = (req, res) => {

    console.log(req.params);
    const id = req.params.id * 1;


    if (id > tours.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};


exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1; // Toma el ultimo tour del array

    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

};

exports.updateTour = (req, res) => {

    if (req.params.id * 1 > tours.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Tour actualizado...>'
        }
    });
};


exports.deleteTour = (req, res) => {

    if (req.params.id * 1 > tours.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};