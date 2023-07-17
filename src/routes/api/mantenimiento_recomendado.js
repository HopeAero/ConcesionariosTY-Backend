const router = require('express').Router();
const {getMaintenanceAll, getMaintenancePaginate, getMaintenancePlaca} = require('./../../controllers/maintenance/getMaintenance');
const {posterMaintenance} = require('./../../controllers/maintenance/posterMaintenance');
const {deleteMaintenance, deleteMaintenanceService} = require('../../controllers/maintenance/deleteMaintenance');

router.get('/', getMaintenancePaginate);

router.get('/all', getMaintenanceAll);

router.get('/:placa_vehiculo', getMaintenancePlaca);

router.post('/', posterMaintenance);

router.delete('/:placa_vehiculo', deleteMaintenance);

router.delete('/:placa_vehiculo/:codigo_servicio', deleteMaintenanceService);

module.exports = router;