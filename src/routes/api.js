const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiAgencyRouter = require('./api/agencia');

router.use('/clientes', apiClientsRouter);

router.use('/agencias', apiAgencyRouter);


module.exports = router;