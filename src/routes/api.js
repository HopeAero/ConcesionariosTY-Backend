const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiStateRouter = require('./api/estados');
const apiCityRouter = require('./api/ciudad');


router.use('/clientes', apiClientsRouter);

router.use('/estados', apiStateRouter);

router.use('/ciudad', apiCityRouter);

module.exports = router;