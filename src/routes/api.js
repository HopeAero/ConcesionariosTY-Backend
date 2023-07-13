const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiModelsRouter = require('./api/modelos');
const apiVehiclesRouter = require('./api/vehiculos');

router.use('/clientes', apiClientsRouter);
router.use('/modelos', apiModelsRouter);
router.use('/vehiculos', apiVehiclesRouter);

module.exports = router;