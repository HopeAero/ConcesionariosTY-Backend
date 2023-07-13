const router = require('express').Router();
const {getAgency, getAgencyByRIF, getAgencyAll} = require('./../../controllers/agency/getAgency');
const {posterAgency} = require('./../../controllers/agency/posterAgency');
const {updateAgency} = require('./../../controllers/agency/updateAgency');
const {deleteAgency} = require('./../../controllers/agency/deleteAgency');

router.get('/', getAgency);

router.get('/all', getAgencyAll);

router.get('/:rif', getAgencyByRIF);

router.post('/', posterAgency);

router.put('/:rif', updateAgency);

router.delete('/:rif', deleteAgency);

module.exports = router;