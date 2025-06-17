const mongoose = require("mongoose")

const ordonnanceSchema = new mongoose.Schema({

    dateOrd: {
        type: Date,
        default: Date.now
    },
    medicaments: [
        {
        nom: String,
        dose: String,
        duree: String
        }
    ],
    remarques: String,

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },

    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },

    fichierOrd:String,

},{timestamps:true}
);

//Exportation
const Ordonnance = mongoose.model("Ordonnance",ordonnanceSchema)
module.exports=Ordonnance