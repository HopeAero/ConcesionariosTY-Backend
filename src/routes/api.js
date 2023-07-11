const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiEmployeesRouter = require('./api/empleados');
const apiAnalystsRouter = require('./api/analistas');

router.use('/clientes', apiClientsRouter);
router.use('/empleados', apiEmployeesRouter);
router.use('/analistas', apiAnalystsRouter);

module.exports = router;