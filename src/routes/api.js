const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiEmployeesRouter = require('./api/empleados');
const apiManagersRouter = require('./api/encargado');
const apiAnalystsRouter = require('./api/analistas');
const apiAgencyRouter = require('./api/agencia');
const apiServiceRouter = require('./api/servicio');
const apiActivityRouter = require('./api/actividad');
const apiModelsRouter = require('./api/modelos');
const apiVehiclesRouter = require('./api/vehiculos');
const apiReserveRouter = require('./api/reserva');
const { ro } = require('date-fns/locale');

router.use('/clientes', apiClientsRouter);

router.use('/modelos', apiModelsRouter);

router.use('/empleados', apiEmployeesRouter);

router.use('/encargados', apiManagersRouter);

router.use('/analistas', apiAnalystsRouter);

router.use('/agencias', apiAgencyRouter);

router.use('/servicios', apiServiceRouter);

router.use('/actividades', apiActivityRouter);

router.use('/vehiculos', apiVehiclesRouter);

router.use('/reservas', apiReserveRouter);

module.exports = router;