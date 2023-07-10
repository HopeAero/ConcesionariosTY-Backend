const { Router } = require('express');
const router = Router();

const apiClientsRouter = require('./api/clientes');
const apiStateRouter = require('./api/estados');
const apiCityRouter = require('./api/ciudad');
const apiSupplyLineRouter = require('./api/linea-suministro');
const apiAgencyRouter = require('./api/agencia');



router.use('/clientes', apiClientsRouter);

router.use('/estados', apiStateRouter);

router.use('/ciudad', apiCityRouter);

router.use('/linea-suministro', apiSupplyLineRouter);

router.use('/agencias', apiAgencyRouter);



module.exports = router;