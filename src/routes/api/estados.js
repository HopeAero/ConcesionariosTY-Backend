const router = require('express').Router();

const {getState, getStateById, getAllState} = require('./../../controllers/State/getState');
const {posterState} = require('./../../controllers/State/posterState');
const {updateState} = require('./../../controllers/State/updateState');
const {deleteState} = require('./../../controllers/State/deleteState');

router.get('/all', getAllState);

router.get('/', getState);

router.get('/:id', getStateById);

router.post('/', posterState);

router.put('/:id', updateState);

router.delete('/:id', deleteState);

module.exports = router;
