const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json()); // Middleware

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message: "Hola mundo", app: "Turismo" });
// })

// app.post('/', (req, res) => {
//     res.send("Enviando datos");
// })

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`);
})

const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tours
        }
    });
});


app.post('/api/v1/tours', (req, res) => {
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

});