const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); // Lee las variables de entorno del archivo config.env
const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, { // Conexion a la base de MongoDB
    useNewUrlParser: true,
    //  useCreateIndex: true,
    //  useFindAndModify: false,
    useUnifiedTopology: true

}).then(() => {
    console.log('Conectado a la base de MongoDB Atlas!');

}).catch((err) => {
    console.log(err);
});



// START SERVER

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`);
})