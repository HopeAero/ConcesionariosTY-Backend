const router = require('express').Router();
const {getCards, getBanksbyTarjeta} = require('../../controllers/cards/getCards');
const {posterCards} = require('../../controllers/cards/posterCards');
const {deleteCard} = require('../../controllers/cards/deleteCards');

router.get('/', getCards);

router.get('/:nro_tarjeta', getBanksbyTarjeta);

router.post('/', posterCards);

router.delete('/:nro_tarjeta', deleteCard);

module.exports = router;

