var express = require('express');
var router = express.Router();
const ordonnanceController = require("../Controllers/ordonnanceController");
const uploadFileOrdonnance = require("../middlewares/uploadFileOrdonnance");


//GET
router.get('/getAllOrds',ordonnanceController.getAllOrdonnances);
router.get('/getOrdById/:id',ordonnanceController.getOrdonnanceById);


//POST
router.post('/addOrdonnance',ordonnanceController.addOrdonnance);
router.post('/uploadPDF',uploadFileOrdonnance.single("fichierOrd"),ordonnanceController.uploadPDFOrd);
router.post('/getOrdByPatient/:id',ordonnanceController.getOrdByPatient);

//PUT
router.put('/updateOrd/:id',ordonnanceController.updateOrdonnance);

//DELETE
router.delete('/deleteOrdById/:id',ordonnanceController.deleteOrdById)


module.exports = router;