const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiStateRouter = require('./api/estados');

router.use('/clientes', apiClientsRouter);

router.use('/estados', apiStateRouter);


module.exports = router;