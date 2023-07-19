const router = require('express').Router();
const {getSpecialize,getSpecializeByCiCod,getAllSpecialize} = require('./../../controllers/specialize/getSpecialize');
const {posterSpecialize} = require('./../../controllers/specialize/posterSpecialize');
const {deleteSpecialize} = require('../../controllers/specialize/deleteSpecialize');

router.get('/', getSpecialize);

router.get('/all', getAllSpecialize);

router.get('/:ci_emp/:cod_serv', getSpecializeByCiCod);

router.post('/', posterSpecialize);

router.delete('/:ci_emp/:cod_serv', deleteSpecialize);

module.exports = router;
