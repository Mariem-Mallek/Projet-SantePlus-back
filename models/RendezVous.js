const mongoose = require("mongoose")

const rendezvousSchema = new mongoose.Schema({

    dateRV:Date,
    heureRV:String,

    statutRV:{
        type:String,
        enum:['refusé','accepté','enAttente','bloqué']
    },

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
const RendezVous = mongoose.model("RendezVous",rendezvousSchema)
module.exports=RendezVous