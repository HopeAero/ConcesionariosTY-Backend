const router = require('express').Router();

const {getActivity, getActivityByCode, getAllActivity} = require('./../../controllers/activity/getActivity');
const {posterActivity} = require('./../../controllers/activity/posterActivity');
const {updateActivity} = require('./../../controllers/activity/updateActivity');
const {deleteActivity} = require('./../../controllers/activity/deleteActivity');

router.get('/', getActivity);

router.get('/all', getAllActivity);

router.get('/:code', getActivityByCode);

router.post('/', posterActivity);

router.put('/:codigo_servicio/:nro_actividad', updateActivity);

router.delete('/:codigo_servicio/:nro_actividad', deleteActivity);

module.exports = router;