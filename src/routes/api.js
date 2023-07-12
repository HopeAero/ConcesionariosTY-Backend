const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiEmployeesRouter = require('./api/empleados');
const apiManagersRouter = require('./api/encargado');

router.use('/clientes', apiClientsRouter);
router.use('/empleados', apiEmployeesRouter);
router.use('/encargados', apiManagersRouter);


module.exports = router;