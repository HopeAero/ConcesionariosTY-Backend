const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiSupplyLineRouter = require('./api/linea-suministro');

router.use('/clientes', apiClientsRouter);

router.use('/linea-suministro', apiSupplyLineRouter);


module.exports = router;