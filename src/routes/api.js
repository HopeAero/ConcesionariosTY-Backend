const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiBanksRouter = require('./api/bancos');

router.use('/clientes', apiClientsRouter);
router.use('/bancos', apiBanksRouter);

module.exports = router;