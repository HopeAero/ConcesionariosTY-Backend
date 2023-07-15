const router = require('express').Router();
const {getServiceOrder,getServiceOrderByCI,getAllServiceOrder} = require('./../../controllers/serviceOrder/getServiceOrder');
const {posterServiceOrder} = require('./../../controllers/serviceOrder/posterServiceOrder');
const {updateServiceOrder} = require('./../../controllers/serviceOrder/updateServiceOrder');
const {deleteServiceOrder} = require('../../controllers/serviceOrder/deleteServiceOrder');

router.get('/', getServiceOrder);

router.get('/all', getAllServiceOrder);

router.get('/:cod', getServiceOrderByCI);

router.post('/', posterServiceOrder);

router.put('/:cod', updateServiceOrder);

router.delete('/:cod', deleteServiceOrder);

module.exports = router;
