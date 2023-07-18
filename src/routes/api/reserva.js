const router = require('express').Router();
const {getReserve, getReserveById, getReserveByPlaca, getReserveAll} = require('./../../controllers/reserve/getReserve');
const {posterReserve} = require('./../../controllers/reserve/posterReserve');
const {updateReserve} = require('./../../controllers/reserve/updateReserve');
const {deleteReserve} = require('./../../controllers/reserve/deleteReserve');

router.get('/', getReserve);

router.get('/all', getReserveAll);

router.get('/:id', getReserveById);

router.get('/placa/:placa', getReserveByPlaca);

router.post('/', posterReserve);

router.put('/:id_reserva', updateReserve);

router.delete('/:id', deleteReserve);

module.exports = router;