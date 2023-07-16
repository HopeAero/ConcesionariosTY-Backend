const router = require('express').Router();
const {getPayments, getPaymentByID, getAllPayments} = require('./../../controllers/payments/getPayments');
const {posterPayment} = require('./../../controllers/payments/posterPayments');
//const {updateClient} = require('./../../controllers/clients/updateClients');
const {deletePayment} = require('../../controllers/payments/deletePayments');

router.get('/', getPayments);

router.get('/all', getAllPayments);

router.get('/:id', getPaymentByID);

router.post('/', posterPayment);

//router.put('/:ci', updateClient);

router.delete('/:id', deletePayment);

module.exports = router;

