const router = require('express').Router();
const {getAgency, getAgencyByRIF} = require('./../../controllers/agency/getAgency');

router.get('/', getAgency);

router.get('/:rif', getAgencyByRIF);

module.exports = router;