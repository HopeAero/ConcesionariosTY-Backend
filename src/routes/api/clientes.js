const router = require('express').Router();
const {getClients, getClientByCI, getAllClients} = require('./../../controllers/clients/getClients');
const {posterClients} = require('./../../controllers/clients/posterClients');
const {updateClient} = require('./../../controllers/clients/updateClients');
const {deleteClient} = require('../../controllers/clients/deleteClients');

router.get('/', getClients);

router.get('/all', getAllClients);

router.get('/:ci', getClientByCI);

router.post('/', posterClients);

router.put('/:ci', updateClient);

router.delete('/:ci', deleteClient);

module.exports = router;
