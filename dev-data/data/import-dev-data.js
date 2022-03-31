// Este archivo permite importar datos de un archivo json local a la nube


const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');

dotenv.config({ path: './config.env' }); // Lee las variables de entorno del archivo config.env


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, { // Conexion a la base de MongoDB
    useNewUrlParser: true,

    useUnifiedTopology: true

}).then(() => {
    console.log('Conectado a la base de la nube!');

}).catch((err) => {
    console.log(err);
});

// Lectura Archivo json


const tours = JSON.parse(fs.readFileSync(require('path').resolve('dev-data/data/tours-simple.json')));

// Importar tours

const importData = async() => {
    try {
        await Tour.create(tours);
        console.log("Datos cargados!")

    } catch (err) {
        console.log(err);
    }
    process.exit();

}


// Eliminar todos los tours

const deleteData = async() => {
    try {
        await Tour.deleteMany();
        console.log("Datos Eliminados!")

    } catch (err) {
        console.log(err);
    }
    process.exit();
}


if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}