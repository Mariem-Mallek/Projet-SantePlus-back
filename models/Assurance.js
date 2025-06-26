const mongoose = require("mongoose")

const AssuranceSchema = new mongoose.Schema({

    dateConsultation: {
        type: Date,
        default: Date.now
    },

    actes: [String],
    montantTotal: Number,
    tauxPriseEnCharge: Number,
    montantRembourse: Number,
    
    statutCNAM: {
        type: String,
        enum: ['en attente', 'envoyée', 'remboursée'],
        default: 'en attente'
    },

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },

    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },

    fichierCNAM:String,

},{timestamps:true}
);

//Exportation
const Assurance = mongoose.model("Assurance",AssuranceSchema)
module.exports=Assurance