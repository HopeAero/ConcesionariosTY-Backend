const router = require('express').Router();
const {getLine, getLineByCode} = require('./../../controllers/supply-line/getLine');
const {posterLine} = require('./../../controllers/supply-line/posterLine');
const {updateLine} = require('./../../controllers/supply-line/updateLine');
const {deleteLine} = require('./../../controllers/supply-line/deleteLine');

router.get('/', getLine);

router.get('/:codigo', getLineByCode);

router.post('/', posterLine);

router.put('/:codigo', updateLine);

router.delete('/:codigo', deleteLine);

module.exports = router;