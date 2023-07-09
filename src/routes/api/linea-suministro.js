const router = require('express').Router();
const {getLine, getLineByCode} = require('./../../controllers/supply-line/getLine');

router.get('/', getLine);

router.get('/:codigo', getLineByCode);

module.exports = router;