const router = require('express').Router();
const {getUtilize,getUtilizeByCi_empCod_servNro_actCod_prod,getAllUtilize} = require('./../../controllers/utilize/getUtilize');
const {posterUtilize} = require('./../../controllers/utilize/posterUtilize');
const {updateUtilize} = require('./../../controllers/utilize/updateUtilize');
const {deleteUtilize} = require('../../controllers/utilize/deleteUtilize');

router.get('/', getUtilize);

router.get('/all', getAllUtilize);

router.get('/:ci_emp/:cod_serv/:nro_act/:cod_prod', getUtilizeByCi_empCod_servNro_actCod_prod);

router.post('/', posterUtilize);

router.put('/:ci_emp/:cod_serv/:nro_act/:cod_prod', updateUtilize);

router.delete('/:ci_emp/:cod_serv/:nro_act/:cod_prod', deleteUtilize);

module.exports = router;
