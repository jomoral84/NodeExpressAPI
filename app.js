const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res
        .status(200)
        .json({ message: "Hola mundo", app: "Turismo" });
})

app.post('/', (req, res) => {
    res.send("Enviando datos");
})


const port = 3000;
app.listen(port, () => {
    console.log(`Servidor actico en el puerto: ${port}`)
});