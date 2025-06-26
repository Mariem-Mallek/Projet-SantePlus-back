const feuilleModel = require("../models/Assurance")
const userModel = require("../models/Utilisateur")

module.exports.addfeuilleCNAM = async (req, res) => {
    try {
        const { patientId } = req.body
        const patient = await userModel.findById(patientId);

        const { medecinId } = req.body
        const medecin = await userModel.findById(medecinId);

        if (!medecin) {
            throw new Error("medecin introuvable");
        }
        const {dateConsultation, actes, montantTotal,tauxPriseEnCharge,montantRembourse} = req.body
        const feuilleCNAM = new feuilleModel({
            dateConsultation,
            actes,
            montantTotal,
            tauxPriseEnCharge,
            montantRembourse,
            statutCNAM:"en attente",
            patient: patient.id,
            medecin: medecin.id
        })
        const feuilleAdded = await feuilleCNAM.save()

        // Ajout de l'assurance à la liste de chaque utilisateur
        await userModel.findByIdAndUpdate(patientId, {$push: { assurances: feuilleCNAM._id } })
        await userModel.findByIdAndUpdate(medecinId, {$push: { assurances: feuilleCNAM._id } })

        res.status(200).json(feuilleAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.uploadPDFCNAM = async (req, res) => {
    try {
        const feuilleCNAMData = { ...req.body }

        if (req.file) {
            const { filename } = req.file;
            feuilleCNAMData.fichierCNAM = filename
        }

        const feuille = new feuilleModel(
            feuilleCNAMData
        )
        const feuilleAdded = await feuille.save()

        // Ajout de l'assurance à la liste de chaque utilisateur
        await userModel.findByIdAndUpdate(feuilleCNAMData.patient, {$push: { assurances: feuille._id } })
        await userModel.findByIdAndUpdate(feuilleCNAMData.medecin, {$push: { assurances: feuille._id } })

        res.status(200).json(feuilleAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getAllFeuilleCNAM = async (req, res) => {
    try {
        const feuillesList = await feuilleModel.find().sort({ dateConsultation: -1 })
        if (feuillesList.length == 0) {
            throw new Error("aucune feuille de CNAM n'est trouvée");
        }
        res.status(200).json(feuillesList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getFeuilleCNAMById = async (req, res) => {
    try {
        const { id } = req.params
        const feuille = await feuilleModel.findById(id)
        if (!feuille) {
            throw new Error("feuille CNAM introuvable");
        }
        res.status(200).json(feuille)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getfeuilleCNAMByPatient = async (req, res) => {
    try {
        const { id } = req.body
        const patient = await userModel.findById(id);

        if (!patient) {
            throw new Error("patient introuvable");
        }

        const feuille = await feuilleModel.find({ patient: patient.id }).populate("patient")
        if (!feuille) {
            throw new Error("feuille CNAM introuvable");
        }
        res.status(200).json(feuille)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.updateStatutCNAM = async (req, res) => {
    try {
        const { id } = req.params
        const { newStatut } = req.body
        const feuille = await feuilleModel.findById(id)
        if (!feuille) {
            throw new Error("feuille CNAM introuvable");
        }

        const updatedFeuille = await feuilleModel.findByIdAndUpdate(
            id,
            {
                $set: {statutCNAM: newStatut}
            }
        )
        res.status(200).json(updatedFeuille)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.updatefeuilleCNAM = async (req, res) => {
    try {
        const { id } = req.params
        const { dateConsultation, actes, montantTotal,tauxPriseEnCharge,montantRembourse } = req.body
        const feuille = await feuilleModel.findById(id)
        if (!feuille) {
            throw new Error("feuille CNAM introuvable");
        }

        const updatedFeuille = await feuilleModel.findByIdAndUpdate(
            id,
            {
                $set: { dateConsultation, actes, montantTotal,tauxPriseEnCharge,montantRembourse }
            }
        )
        res.status(200).json(updatedFeuille)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.deleteFeuilleCNAM = async (req, res) => {
    try {
        const { id } = req.params
        const feuille = await feuilleModel.findByIdAndDelete(id)
        if (!feuille) {
            throw new Error("feuille CNAM introuvable");
        }

        await userModel.updateMany({},{$pull: { assurances: feuille._id }})
        res.status(200).json("Feuille CNAM supprimée avec succés")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}