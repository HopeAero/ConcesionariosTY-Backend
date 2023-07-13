const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiEmployeesRouter = require('./api/empleados');
const apiManagersRouter = require('./api/encargado');
const apiAnalystsRouter = require('./api/analistas');
const apiAgencyRouter = require('./api/agencia');

router.use('/clientes', apiClientsRouter);
router.use('/empleados', apiEmployeesRouter);
router.use('/encargados', apiManagersRouter);
router.use('/analistas', apiAnalystsRouter);

router.use('/agencias', apiAgencyRouter);


module.exports = router;