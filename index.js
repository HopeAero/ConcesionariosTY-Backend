//DOTENV
require('dotenv').config();

//MODULES
const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./src/routes/api');

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// ROUTES
app.use('/',apiRouter);

// SERVER
app.listen(3000, () => {
    console.log('Servidor activo en el puerto 3000');
});
