var express = require('express');
var router = express.Router();
const RVController = require("../Controllers/rendezvousController");


//GET
router.get('/getAllRVS',RVController.getAllRV);
router.get('/getRVById/:id',RVController.getRVById);


//POST
router.post('/getRVByPatient/:id',RVController.getAllRVByPatient);
router.post('/getRVByMedecin/:id',RVController.getAllRVByMedecin);
router.post('/fixerRV',RVController.fixerRendezVous);
router.post('/getDisponibilites/:id', RVController.getCreneauxDispos);
router.post('/bloquerCreneau/:id', RVController.bloquerCreneauDispo); 


//PUT
router.put('/updateRV/:id',RVController.updateRV);
router.put('/updateStatutRV/:id',RVController.updateStatutRV);


//DELETE
router.delete('/deleteRVById/:id',RVController.deleteRV)



module.exports = router;