const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' }); // Lee las variables de entorno del archivo config.env

// console.log(process.env);



// START SERVER

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`);
})