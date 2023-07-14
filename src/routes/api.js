const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiBanksRouter = require('./api/bancos');
const apiProductsRouter = require('./api/productos');

router.use('/clientes', apiClientsRouter);
router.use('/bancos', apiBanksRouter);
router.use('/productos', apiProductsRouter);

module.exports = router;