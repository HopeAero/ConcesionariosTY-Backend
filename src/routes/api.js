const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiCityRouter = require('./api/ciudad');

router.use('/clientes', apiClientsRouter);

router.use('/ciudad', apiCityRouter);

module.exports = router;