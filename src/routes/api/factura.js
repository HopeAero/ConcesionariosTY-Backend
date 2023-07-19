const router = require('express').Router();
const {getAllBill, getBill, getBillByOrdenServicio, getBillNro} = require('../../controllers/bill/getBill');
const {posterBill} = require('../../controllers/bill/posterBill');
const {deleteBill} = require('../../controllers/bill/deleteBill');

router.get('/', getBill);

router.get('/nro/:nro_factura', getBillNro);

router.get('/orden-servicio/:codigo_orden_servicio', getBillByOrdenServicio);

router.get('/all', getAllBill);

router.post('/', posterBill);

router.delete('/:nro_factura', deleteBill);


module.exports = router;