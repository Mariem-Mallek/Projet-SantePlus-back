const mongoose = require("mongoose")

const InteractionSchema = new mongoose.Schema({

    typeInteraction:{
        type:String,
        enum:['message','email']
    },

    contenuInteraction:String,
    

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },

    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },


},{timestamps:true}
);

//Exportation
const Interaction = mongoose.model("Interaction",InteractionSchema)
module.exports=Interaction