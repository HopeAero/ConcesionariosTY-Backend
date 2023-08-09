//DOTENV
require('dotenv').config();

//MODULES
const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./src/routes/api');
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// ROUTES
app.use('/',apiRouter);

// SERVER
app.listen(PORT, () => {
    console.log('Servidor activo en el puerto ' + PORT);
});
