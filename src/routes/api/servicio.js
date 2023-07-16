const router = require('express').Router();
const {getService, getServiceByCode, getAllServices} = require('./../../controllers/service/getService');
const {posterService} = require('./../../controllers/service/posterService');
const {updateService} = require('./../../controllers/service/updateService');
const {deleteService} = require('./../../controllers/service/deleteService');

router.get('/', getService);

router.get('/all', getAllServices);

router.get('/:code', getServiceByCode);

router.post('/', posterService);

router.put('/:code', updateService);

router.delete('/:code', deleteService);

module.exports = router;