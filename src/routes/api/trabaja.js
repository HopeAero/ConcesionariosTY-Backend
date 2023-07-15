const router = require('express').Router();
const {getWork, getWorkByRIF, getWorkByCI, getWorkByRIFAndCI, getWorkAll} = require('./../../controllers/work/getWork');
const {posterWork} = require('./../../controllers/work/posterWork');
const {deleteWork} = require('./../../controllers/work/deleteWork');

router.get('/', getWork);

router.get('/rif/:rif', getWorkByRIF);

router.get('/ci/:ci', getWorkByCI);

router.get('/rif/:rif/ci/:ci', getWorkByRIFAndCI);

router.get('/all', getWorkAll);

router.post('/', posterWork);

router.delete('/rif/:rif/ci/:ci', deleteWork);

module.exports = router;