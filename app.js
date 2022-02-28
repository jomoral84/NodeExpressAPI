const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

// MIDDLEWARES

app.use(express.json()); // Middleware
app.use(morgan('dev'));


app.use((req, res, next) => { // Se define un middleware global antes de los route handlers
    console.log("Hola desde el middleware");
    next();
})


app.use((req, res, next) => { // Se define un middleware para saber el horario del request
    req.requestTime = new Date().toISOString();
    next();
})



// START SERVER

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`);
})

const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// ROUTE HANDLERS


const getAllTours = (req, res) => {

    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        time: req.requestTime,
        data: {
            tours
        }
    });
};

const getOneTour = (req, res) => {

    console.log(req.params);
    const id = req.params.id * 1;


    if (id > tours.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};


const createTour = (req, res) => {
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

};

const updateTour = (req, res) => {

    if (req.params.id * 1 > tours.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Tour actualizado...>'
        }
    });
};


const deleteTour = (req, res) => {

    if (req.params.id * 1 > tours.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};


app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getOneTour);

app.post('/api/v1/tours', createTour);

app.patch('/api/v1/tours/:id', updateTour);

app.delete('/api/v1/tours/:id', deleteTour);



// USERS 

const getAllUsers = (req, res) => {

    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        time: req.requestTime,
        data: {
            users
        }
    });
};


const getUser = (req, res) => {

    console.log(req.params);
    const id = req.params.id * 1;


    if (id > users.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    const user = users.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
};


const createUser = (req, res) => {
    const newId = users[users.length - 1].id + 1; // Toma el ultimo tour del array

    const newUser = Object.assign({ id: newId }, req.body);
    users.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
        res.status(200).json({
            status: 'success',
            data: {
                tour: newUser
            }
        });
    });

};

const updateUser = (req, res) => {

    if (req.params.id * 1 > users.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Usuario actualizado...>'
        }
    });
};


const deleteUser = (req, res) => {

    if (req.params.id * 1 > users.length) { // Valida si se supera el largo del array
        return res.status(404).json({
            status: 'fail',
            message: 'Id invalido'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};



// ROUTERS


const userRouter = express.Router(); // ROUTER



userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


app.use('/api/v1/users', userRouter);