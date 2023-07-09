const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');

router.use('/clientes', apiClientsRouter);


module.exports = router;