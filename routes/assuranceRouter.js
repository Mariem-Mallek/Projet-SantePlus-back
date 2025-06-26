var express = require('express');
var router = express.Router();
const assuranceController = require("../Controllers/assuranceController");
const uploadFileAssurance = require("../middlewares/uploadFileAssurance");


//GET
router.get('/getAllAssurances',assuranceController.getAllFeuilleCNAM);
router.get('/getAssuranceById/:id',assuranceController.getFeuilleCNAMById);


//POST
router.post('/addAssurance',assuranceController.addfeuilleCNAM);
router.post('/uploadPDF',uploadFileAssurance.single("fichierCNAM"),assuranceController.uploadPDFCNAM);
router.post('/getAssuranceByPatient/:id',assuranceController.getfeuilleCNAMByPatient);


//PUT
router.put('/updateAssurance/:id',assuranceController.updatefeuilleCNAM);
router.put('/updateStatutAssurance/:id',assuranceController.updateStatutCNAM);


//DELETE
router.delete('/deleteAssuranceById/:id',assuranceController.deleteFeuilleCNAM)



module.exports = router;