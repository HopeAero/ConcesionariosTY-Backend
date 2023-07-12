const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiModelsRouter = require('./api/modelos');

router.use('/clientes', apiClientsRouter);
router.use('/modelos', apiModelsRouter);


module.exports = router;