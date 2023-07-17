const router = require('express').Router();
const {getDetail, getDetailByCode, getDetailAll} = require('./../../controllers/detail/getDetail');
const {posterDetail} = require('./../../controllers/detail/posterDetail');
const {updateDetail} = require('./../../controllers/detail/updateDetail');
const {deleteDetail} = require('./../../controllers/detail/deleteDetail');

router.get('/', getDetail);

router.get('/all', getDetailAll);

router.get('/:codigo_servicio', getDetailByCode);

router.post('/', posterDetail);

router.put('/:codigo_servicio/:nro_actividad/:nro_detalle', updateDetail);

router.delete('/:codigo_servicio', deleteDetail )

module.exports = router;