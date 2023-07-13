const router = require('express').Router();
const {getVehicles,getVehicleByCI,getAllVehicles} = require('./../../controllers/vehicles/getVehicles');
const {posterVehicles} = require('./../../controllers/vehicles/posterVehicles');
const {updateVehicle} = require('./../../controllers/vehicles/updateVehicles');
const {deleteVehicle} = require('../../controllers/vehicles/deleteVehicles');

router.get('/', getVehicles);

router.get('/all', getAllVehicles);

router.get('/:placa', getVehicleByCI);

router.post('/', posterVehicles);

router.put('/:placa', updateVehicle);

router.delete('/:placa', deleteVehicle);

module.exports = router;
