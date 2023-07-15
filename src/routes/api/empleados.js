const router = require('express').Router();
const {getEmployees,getAllEmployees,getEmployeesByCI, getEmployeesByTipo} = require('./../../controllers/employees/getEmployees');
const {posterEmployees} = require('./../../controllers/employees/posterEmployees');
const {updateEmployee} = require('./../../controllers/employees/updateEmployees');
const {deleteEmployee} = require('../../controllers/employees/deleteEmployees');

router.get('/', getEmployees);

router.get('/all', getAllEmployees);

router.get('/:ci', getEmployeesByCI);

router.get('/type/:tipo_empleado', getEmployeesByTipo);

router.post('/', posterEmployees);

router.put('/:ci', updateEmployee);

router.delete('/:ci', deleteEmployee);

module.exports = router;
