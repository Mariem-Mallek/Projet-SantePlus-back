var express = require('express');
var router = express.Router();
const os = require("os")
const osController = require("../Controllers/osControllers")

/* GET users listing. */
router.get('/getInformation',osController.getOsInfos);
router.get('/cpu',osController.osCpus);
router.get('/cpuById/:id',osController.osCpusById);

module.exports = router;
