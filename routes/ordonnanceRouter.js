var express = require('express');
var router = express.Router();
const ordonnanceController = require("../Controllers/ordonnanceController");
const uploadFileOrdonnance = require("../middlewares/uploadFileOrdonnance");
const { deleteOne } = require('../models/Utilisateur');

//GET
router.get('/getAllOrds',ordonnanceController.getAllOrdonnances);


//POST
router.post('/addOrdonnance',ordonnanceController.addOrdonnance);
router.post('/getOrdByPatient/:id',ordonnanceController.getOrdByPatient);

//PUT
router.put('/updateOrd/:id',ordonnanceController.updateOrdonnance);

//DELETE
router.delete('/deleteOrdById/:id',ordonnanceController.deleteOrdById)


module.exports = router;