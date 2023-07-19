const router = require('express').Router();
const {getAnalysts, getAnalystByCI, getAllAnalysts} = require('./../../controllers/analysts/getAnalysts');
const {posterAnalysts} = require('./../../controllers/analysts/posterAnalysts');
const {updateAnalyst} = require('../../controllers/analysts/update');
const {deleteAnalyst} = require('../../controllers/analysts/deleteAnalysts');

router.get('/', getAnalysts);

router.get('/all', getAllAnalysts);

router.get('/:ci', getAnalystByCI);

router.post('/', posterAnalysts);

router.put('/:ci', updateAnalyst);

router.delete('/:ci', deleteAnalyst);

module.exports = router;    