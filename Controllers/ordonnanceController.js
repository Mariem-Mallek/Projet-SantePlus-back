const ordonnanceModel = require("../models/Ordonnance")
const userModel = require("../models/Utilisateur")

module.exports.addOrdonnance = async (req, res) => {
    try {
        const { patientId } = req.body
        const patient = await userModel.findById(patientId);

        const { medecinId } = req.body
        const medecin = await userModel.findById(medecinId);

        if (!medecin) {
            throw new Error("medecin introuvable");
        }
        const { dateOrd, medicaments, remarques } = req.body
        const ordonnance = new ordonnanceModel({
            dateOrd,
            medicaments,
            remarques,
            patient: patient.id,
            medecin: medecin.id
        })
        const ordonnanceAdded = await ordonnance.save()

        // Ajout de l'ordonnance à la liste de chaque utilisateur
        await userModel.findByIdAndUpdate(patientId, {$push: { ordonnances: ordonnance._id } })
        await userModel.findByIdAndUpdate(medecinId, {$push: { ordonnances: ordonnance._id } })

        res.status(200).json(ordonnanceAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.uploadPDFOrd = async (req, res) => {
    try {
        const ordonnanceData = { ...req.body }
        if (typeof ordonnanceData.medicaments === 'string') {
            ordonnanceData.medicaments = JSON.parse(ordonnanceData.medicaments);
        }

        if (req.file) {
            const { filename } = req.file;
            ordonnanceData.fichierOrd = filename
        }

        const ordonnance = new ordonnanceModel(
            ordonnanceData
        )
        const ordonnanceAdded = await ordonnance.save()
        res.status(200).json(ordonnanceAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getAllOrdonnances = async (req, res) => {
    try {
        const ordList = await ordonnanceModel.find().sort({ dateOrd: -1 })
        if (ordList.length == 0) {
            throw new Error("aucune ordonnance est introuvable");
        }
        res.status(200).json(ordList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getOrdonnanceById = async (req, res) => {
    try {
        const { id } = req.params
        const ordonnance = await ordonnanceModel.findById(id)
        if (!ordonnance) {
            throw new Error("ordonnance introuvable");
        }
        res.status(200).json(ordonnance)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getOrdByPatient = async (req, res) => {
    try {
        const { id } = req.body
        const patient = await userModel.findById(id);

        if (!patient) {
            throw new Error("patient introuvable");
        }

        const ordonnance = await ordonnanceModel.find({ patient: patient.id }).populate("patient")
        if (!ordonnance) {
            throw new Error("ordonnance introuvable");
        }
        res.status(200).json(ordonnance)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.updateOrdonnance = async (req, res) => {
    try {
        const { id } = req.params
        const { dateOrd, medicaments, remarques } = req.body
        const ordonnance = await ordonnanceModel.findById(id)
        if (!ordonnance) {
            throw new Error("ordonnance introuvable");
        }

        const updatedOrdonnance = await ordonnanceModel.findByIdAndUpdate(
            id,
            {
                $set: { dateOrd, medicaments, remarques }
            }
        )
        res.status(200).json(updatedOrdonnance)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.deleteOrd = async (req, res) => {
    try {
        const { id } = req.params
        const ordonnance = await ordonnanceModel.findByIdAndDelete(id)
        if (!ordonnance) {
            throw new Error("ordonnance introuvable");
        }

        await userModel.updateMany({},{$pull: { ordonnances: ordonnance._id }})
        res.status(200).json("ordonnance supprimée avec succés")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}