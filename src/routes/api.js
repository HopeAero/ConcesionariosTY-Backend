const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiEmployeesRouter = require('./api/empleados');

router.use('/clientes', apiClientsRouter);
router.use('/empleados', apiEmployeesRouter);


module.exports = router;