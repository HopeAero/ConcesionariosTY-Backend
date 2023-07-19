const router = require('express').Router();

const {servicedVehicleModels, servicedVehicleModelsType, personalMostServicedForMONTH, personalMinServiceForMONTH, ProductosMasVendidos, ProductosMenosVendido, listOrdenClient, servicesMore, servicesMin, promEcology, historyVehicle, agencyMoreFactura, agencyMinFactura, clientNotService} = require('../../controllers/statistics/querystatistic');

router.get('/servicedVehicleModels', servicedVehicleModels);

router.get('/servicedVehicleModelsType', servicedVehicleModelsType);

router.get('/personalMostServicedForMONTH', personalMostServicedForMONTH);

router.get('/personalMinServiceForMONTH', personalMinServiceForMONTH);

router.get('/ProductosMasVendidos', ProductosMasVendidos);

router.get('/ProductosMenosVendido', ProductosMenosVendido);

router.get('/listOrdenClient', listOrdenClient);

router.get('/servicesMore', servicesMore);

router.get('/servicesMin', servicesMin);

router.get('/promEcology', promEcology);

router.get('/historyVehicle', historyVehicle);

router.get('/agencyMoreFactura', agencyMoreFactura);

router.get('/agencyMinFactura', agencyMinFactura);

router.get('/clientNotService', clientNotService);

module.exports = router
