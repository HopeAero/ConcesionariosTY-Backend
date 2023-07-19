const router = require('express').Router();
const {getLine, getLineByCode, getAllLine} = require('./../../controllers/supply-line/getLine');
const {posterLine} = require('./../../controllers/supply-line/posterLine');
const {updateLine} = require('./../../controllers/supply-line/updateLine');
const {deleteLine} = require('./../../controllers/supply-line/deleteLine');

router.get('/all', getAllLine);

router.get('/', getLine);

router.get('/:codigo', getLineByCode);

router.post('/', posterLine);

router.put('/:codigo', updateLine);

router.delete('/:codigo', deleteLine);

module.exports = router;