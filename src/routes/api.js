const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiBanksRouter = require('./api/tarjetas');

router.use('/clientes', apiClientsRouter);
router.use('/tarjetas', apiBanksRouter);

module.exports = router;