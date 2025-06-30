var express = require('express');
var router = express.Router();
const userController = require("../Controllers/utilisateurController");
const uploadFilePatient = require("../middlewares/uploadFilePatient");
const uploadFileMedecin = require("../middlewares/uploadFileMedecin");
const uploadFileAdmin = require("../middlewares/uploadFileAdmin");

const {requireAuthUser} = require("../middlewares/authMiddlewares");
const {controleAcces} = require("../middlewares/controleAcces");


//GET
router.get('/getAllUsers',requireAuthUser,controleAcces,userController.getAllUsers);
router.get('/localisation',requireAuthUser,userController.getMedecinsByLocalisation);
router.get('/getUserById/:id',requireAuthUser,userController.getUserById);

//POST
router.post('/addPatient',userController.addPatient);
router.post('/addMedecin',userController.addMedecin);
router.post('/addAdmin',userController.addAdmin);
router.post('/addPatientWithImg',uploadFilePatient.single("image"),userController.addPatientWithImg);
router.post('/addMedecinWithImg',uploadFileMedecin.single("image"),userController.addMedecinWithImg);
router.post('/addAdminWithImg',uploadFileAdmin.single("image"),userController.addAdminWithImg);
router.post('/getUserByEmail',userController.getUserByEmail);
router.post('/login', userController.loginUser);
router.post('/logout',requireAuthUser,userController.logoutUser);


//PUT
router.put('/updateUser/:id',userController.updateUser);
router.put('/updateMdp/:id',userController.updateMdp);
router.put('/updateLocal/:id',userController.updateLocalisation);

//DELETE
router.delete('/deleteUserById/:id',userController.deleteUserById)

module.exports = router;