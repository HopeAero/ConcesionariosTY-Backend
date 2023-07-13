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

router.use('/empleados', apiEmployeesRouter);

router.use('/encargados', apiManagersRouter);

router.use('/estados', apiStateRouter);

router.use('/ciudad', apiCityRouter);

router.use('/linea-suministro', apiSupplyLineRouter);

router.use('/agencias', apiAgencyRouter);

router.use('/analistas', apiAnalystsRouter);

router.use('/tarjetas', apiBanksRouter);




module.exports = router;