const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' }); // Lee las variables de entorno del archivo config.env

// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, { // Conexion a la base de MongoDB
    useNewUrlParser: true,
    //  useCreateIndex: true,
    //  useFindAndModify: false,
    useUnifiedTopology: true

}).then(() => {
    console.log('Conectado a la base de la nube!');

}).catch((err) => {
    console.log(err);
});


/*
const testTour = new Tour({

    name: 'Palacio Barolo',
    price: 500,
    rating: 4.0
});

testTour.save().then(doc => { // Guarda el docuemento en la nube
    console.log(doc);

}).catch(err => {
    console.log("ERROR", err);
})    */





// START SERVER

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`);
})