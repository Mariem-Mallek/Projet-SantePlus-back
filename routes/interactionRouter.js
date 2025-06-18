var express = require('express');
var router = express.Router();
const interactionController = require("../Controllers/interactionController");


//GET
router.get('/getAllInteractions',interactionController.getAllInteractions);


//POST
router.post('/addInteraction',interactionController.addInteraction);


//PUT
router.put('/updateInteraction/:id',interactionController.updateInteraction);

//DELETE
router.delete('/deleteInterById/:id',interactionController.deleteInteraction)


module.exports = router;