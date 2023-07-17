const { Router } = require("express");
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
const apiVehiclesRouter = require('./api/vehiculos');
const apiServiceRouter = require('./api/servicio');
const apiActivityRouter = require('./api/actividad');
const apiServiceOrderRouter = require('./api/orden-servicio');
const apiWorkRouter = require('./api/trabaja');
const apiReserveRouter = require('./api/reserva');
const apiSpecializeRouter = require('./api/especializa');
const apiPaymentRouter = require('./api/pagos');
const apiDetailRouter = require('./api/detalle');
const apiHireRouter = require('./api/contrata');
const apiMantenimientoRecomendadoRouter = require('./api/mantenimiento_recomendado');
const apiUtilizeRouter = require("./api/utiliza");
const apiProductsRouter = require("./api/productos");

router.use("/modelos", apiModelsRouter);

router.use("/empleados", apiEmployeesRouter);

router.use("/encargados", apiManagersRouter);

router.use("/analistas", apiAnalystsRouter);

router.use("/estados", apiStateRouter);

router.use("/ciudad", apiCityRouter);

router.use("/linea-suministro", apiSupplyLineRouter);

router.use("/agencias", apiAgencyRouter);

router.use("/tarjetas", apiBanksRouter);

router.use('/vehiculos', apiVehiclesRouter);

router.use('/actividades', apiActivityRouter);

router.use('/reservas', apiReserveRouter);

router.use("/servicios", apiServiceRouter);

router.use("/trabaja", apiWorkRouter);

router.use("/especializa", apiSpecializeRouter);

router.use("/pagos", apiPaymentRouter);

router.use("/orden-servicio", apiServiceOrderRouter);

router.use("/detalle", apiDetailRouter);

router.use("/clientes", apiClientsRouter);

router.use('/contrata', apiHireRouter);

router.use('/mantenimiento-recomendado', apiMantenimientoRecomendadoRouter);

router.use("/productos", apiProductsRouter);

router.use("/utiliza", apiUtilizeRouter);

module.exports = router;
