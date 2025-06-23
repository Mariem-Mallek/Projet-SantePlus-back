const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const utilisateurSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: {
        type: String,
        require: true,
        unique: true
    },
    mdp: {
        type: String,
        require: true,
        /*validate :{
            validator: function(value){
                return /.../.test(value);
            },
            message:
                mdp doit contenir au moins 8 caracteres
        }*/
    },
    image: {
        type: String,
        default: "utilisateur.png"
    },
    dateNaiss: Date,
    role: {
        type: String,
        enum: ['patient', 'medecin', 'admin']
    },

    //Patient 
    sexe: String,
    poids: Number,
    taille: Number,

    //Medecin
    numProfessionnel: String,
    specialite: String,
    latitude: Number,
    longitude: Number,
    ville: String,
    adresse: String,

    //Admin
    dateEmbauche: Date,


    rendezVous: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RendezVous"
    }],

    ordonnances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ordonnance"
    }],
    
    interactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interaction"
    }],




}, { timestamps: true }
);

//Hashage : Actions avant sauvegarde
utilisateurSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt()
        const user = this
        user.mdp = await bcrypt.hash(user.mdp, salt)
        next()
    } catch (error) {
        next(error)
    }
})

//Exportation
const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema)
module.exports = Utilisateur