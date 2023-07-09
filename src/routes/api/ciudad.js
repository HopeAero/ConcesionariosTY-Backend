const router = require('express').Router();

const {getCity, getCityByState} = require('./../../controllers/city/getCity');
const {posterCity} = require('./../../controllers/city/posterCity');
const {updateCity} = require('./../../controllers/city/updateCity');
const {deleteCity} = require('./../../controllers/city/deleteCity');

router.get('/', getCity);

router.get('/:id_estado', getCityByState);

router.post('/', posterCity);

router.put('/:id_estado/:nro_ciudad', updateCity);

router.delete('/:id_estado/:nro_ciudad', deleteCity);

module.exports = router;