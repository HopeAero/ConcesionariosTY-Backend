const router = require('express').Router();
const { getManagers, getManagerByCI, getAllManagers} = require('./../../controllers/managers/getManagers');
const { posterManagers } = require('./../../controllers/managers/posterManagers');
const { updaterManager } = require('./../../controllers/managers/updateManagers');
const { deleteManager } = require('./../../controllers/managers/deleteManagers');

router.get('/', getManagers);

router.get('/all', getAllManagers);

router.get('/:ci', getManagerByCI);

router.post('/', posterManagers);

router.put('/:ci', updaterManager);

router.delete('/:ci', deleteManager);




module.exports = router;