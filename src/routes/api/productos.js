const router = require('express').Router();
const { getProduct, getProductByCodLinea, getAllProducts} = require('./../../controllers/products/getProducts');
const {posterProduct} = require('./../../controllers/products/posterProducts');
const {updateProduct} = require('./../../controllers/products/updateProducts');
const {deleteProduct} = require('../../controllers/products/deleteProducts');

router.get('/all', getAllProducts);

router.get('/', getProduct);

router.get('/:codigo_linea_s', getProductByCodLinea);

router.post('/', posterProduct);

router.put('/:codigo_linea_s/:codigo', updateProduct);

router.delete('/:codigo_linea_s/:codigo', deleteProduct);

module.exports = router;
