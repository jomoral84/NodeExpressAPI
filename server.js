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

const tourSchema = new mongoose.Schema({ // Esquema basico de mongoose
    name: {
        type: String,
        required: [true, "Debe tener un nombre"], // Valida los datos
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Debe tener un precio"]
    },
    rating: {
        type: Number,
        default: 4.5
    }
})


const Tour = mongoose.model('Tour', tourSchema);



// START SERVER

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`);
})