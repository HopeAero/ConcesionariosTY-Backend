const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiStateRouter = require('./api/estados');
const apiCityRouter = require('./api/ciudad');
const apiSupplyLineRouter = require('./api/linea-suministro');
const apiAgencyRouter = require('./api/agencia');
const apiEmployeesRouter = require('./api/empleados');
const apiAnalystsRouter = require('./api/analistas');
const apiBanksRouter = require('./api/tarjetas');
const apiManagersRouter = require('./api/encargado');
const apiModelsRouter = require('./api/modelos');

router.use('/clientes', apiClientsRouter);
router.use('/modelos', apiModelsRouter);


module.exports = router;