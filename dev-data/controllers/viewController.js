const Tour = require('../models/tourModel');



exports.getOverview = async(req, res) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Todos Los Tours',
        tours
    })
}


exports.getTour = async(req, res) => {

    // const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    //     path: 'reviews',
    //     select: 'review rating user'
    // });

    const tour = await Tour.findOne({ slug: req.params.slug });

    res.status(200).render('tour', {
        title: 'The Forest Hiker',
        tour
    });
}