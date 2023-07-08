const router = require('express').Router();

const {getCity, getCityByState} = require('./../../controllers/city/getCity');

router.get('/', getCity);

router.get('/:id_estado', getCityByState);

module.exports = router;