const router = require('express').Router();
const { getHire, getHireByIdResCodSer, getAllHire} = require('./../../controllers/hire/getHire');
const { posterHire } = require('./../../controllers/hire/posterHire');
const { updateHire } = require('./../../controllers/hire/updateHire');
const { deleteHire } = require('./../../controllers/hire/deleteHire');

router.get('/', getHire);

router.get('/all', getAllHire);

router.get('/:idRes/:codSer', getHireByIdResCodSer);

router.post('/', posterHire);

router.put('/:idRes/:codSer', updateHire);

router.delete('/:idRes/:codSer', deleteHire);




module.exports = router;