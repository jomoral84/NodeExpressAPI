const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');



exports.getOverview = async(req, res) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Todos Los Tours',
        tours: tours
    })

}


exports.getTour = async(req, res) => {

    // 1) Get the data, for the requested tour (including reviews and guides)

    const tour = await Tour.findOne({ slug: req.params.slug }, (error, post) => {
        console.log(error, post)
    });

    res.status(200).render('tour', {
        title: 'Tour',
        tour
    });

}


exports.getOneTourById = async(req, res) => {

    const tour = await Tour.findById({ _id: req.params.id });

    if (tour) {
        res.status(200).render('tour', {
            title: `${tour.name} Tour`,
            tour
        });
    }
}