const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');


exports.getOverview = async(req, res, next) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Todos Los Tours',
        tours
    })
}


exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'Tour'
    })
}