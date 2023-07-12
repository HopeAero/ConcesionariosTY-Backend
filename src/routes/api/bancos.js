const router = require('express').Router();
const {getBanks, getBanksbyTarjeta} = require('./../../controllers/bank/getBanks');
const {posterBanks} = require('./../../controllers/bank/posterBanks');
const {deleteBank} = require('../../controllers/bank/deleteBanks');

router.get('/', getBanks);

router.get('/:nro_tarjeta', getBanksbyTarjeta);

router.post('/', posterBanks);

router.delete('/:nro_tarjeta', deleteBank);

module.exports = router;

