const router = require('express').Router();
const {getModels,getModelByCI,getAllModels} = require('./../../controllers/models/getModels');
const {posterModels} = require('./../../controllers/models/posterModels');
const {updateModel} = require('./../../controllers/models/updateModels');
const {deleteModel} = require('../../controllers/models/deleteModels');

router.get('/', getModels);

router.get('/all', getAllModels);

router.get('/:cod', getModelByCI);

router.post('/', posterModels);

router.put('/:cod', updateModel);

router.delete('/:cod', deleteModel);

module.exports = router;
