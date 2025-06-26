var express = require('express');
var router = express.Router();
const userController = require("../Controllers/utilisateurController");
const uploadFilePatient = require("../middlewares/uploadFilePatient");
const uploadFileMedecin = require("../middlewares/uploadFileMedecin");
const uploadFileAdmin = require("../middlewares/uploadFileAdmin");


//GET
router.get('/getAllUsers',userController.getAllUsers);
router.get('/localisation',userController.getMedecinsByLocalisation);
router.get('/getUserById/:id',userController.getUserById);

//POST
router.post('/addPatient',userController.addPatient);
router.post('/addMedecin',userController.addMedecin);
router.post('/addAdmin',userController.addAdmin);
router.post('/addPatientWithImg',uploadFilePatient.single("image"),userController.addPatientWithImg);
router.post('/addMedecinWithImg',uploadFileMedecin.single("image"),userController.addMedecinWithImg);
router.post('/addAdminWithImg',uploadFileAdmin.single("image"),userController.addAdminWithImg);
router.post('/getUserByEmail',userController.getUserByEmail);


//PUT
router.put('/updateUser/:id',userController.updateUser);
router.put('/updateMdp/:id',userController.updateMdp);
router.put('/updateLocal/:id',userController.updateLocalisation);

//DELETE
router.delete('/deleteUserById/:id',userController.deleteUserById)

module.exports = router;