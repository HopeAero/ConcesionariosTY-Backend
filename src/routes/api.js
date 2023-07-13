const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiStateRouter = require('./api/estados');
const apiCityRouter = require('./api/ciudad');
const apiSupplyLineRouter = require('./api/linea-suministro');
const apiAgencyRouter = require('./api/agencia');
const apiEmployeesRouter = require('./api/empleados');
const apiAnalystsRouter = require('./api/analistas');
const apiBanksRouter = require('./api/bancos');
const apiManagersRouter = require('./api/encargado');



router.use('/clientes', apiClientsRouter);

router.use('/empleados', apiEmployeesRouter);

router.use('/encargados', apiManagersRouter);

router.use('/estados', apiStateRouter);

router.use('/ciudad', apiCityRouter);

router.use('/linea-suministro', apiSupplyLineRouter);

router.use('/agencias', apiAgencyRouter);

router.use('/analistas', apiAnalystsRouter);

router.use('/bancos', apiBanksRouter);



module.exports = router;