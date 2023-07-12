const router = require('express').Router();
const { getManagers, getManagerByCI, getAllManagers} = require('./../../controllers/managers/getManagers');
const { posterManagers } = require('./../../controllers/managers/posterManagers');

router.get('/', getManagers);

router.get('/all', getAllManagers);

router.get('/:ci', getManagerByCI);

router.post('/', posterManagers);




module.exports = router;