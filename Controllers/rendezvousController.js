const rendezvousModel = require("../models/RendezVous")
const userModel = require("../models/Utilisateur")
const genererCreneaux = require('../utils/Creneaux');


module.exports.fixerRendezVous = async (req, res) => {
    try {

        const { dateRV, heureRV, patientId, medecinId} = req.body

        const patient = await userModel.findById(patientId);
        if (!patient) throw new Error("patient introuvable");

        const medecin = await userModel.findById(medecinId);
        if (!medecin) throw new Error("medecin introuvable");

        const RV = new rendezvousModel({
            dateRV,
            heureRV,
            patient: patientId,
            medecin: medecinId,
            statutRV: 'enAttente'
        });

        const RVfixer = await RV.save()

        // Ajout du RV à la liste de chaque utilisateur
        await userModel.findByIdAndUpdate(patientId,{$push: { rendezVous: RV._id }})
        await userModel.findByIdAndUpdate(medecinId,{$push: { rendezVous: RV._id }})

        res.status(200).json(RVfixer)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getAllRV = async (req, res) => {
    try {
        const RVList = await rendezvousModel.find().sort({ dateRV: -1 })
        if (RVList.length == 0) {
            throw new Error("aucun rendez-vous prevu");
        }
        res.status(200).json(RVList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getRVById = async (req, res) => {
    try {
        const { id } = req.params
        const RV = await rendezvousModel.findById(id)
        if (!RV) {
            throw new Error("rendez-vous introuvable");
        }
        res.status(200).json(RV)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getAllRVByPatient = async (req, res) => {
    try {
        const { id } = req.body
        const patient = await userModel.findById(id);
        if (!patient) {
            throw new Error("patient introuvable");
        }

        const RV = await rendezvousModel.find({ patient: patient.id }).populate("medecin")
        if (!RV) {
            throw new Error("aucun rendez-vous prevu");
        }
        res.status(200).json(RV)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getAllRVByMedecin = async (req, res) => {
    try {
        const { id } = req.body
        const medecin = await userModel.findById(id);
        if (!medecin) {
            throw new Error("medecin introuvable");
        }

        const RV = await rendezvousModel.find({ medecin: medecin.id }).populate("patient")
        if (!RV) {
            throw new Error("aucun rendez-vous prevu");
        }
        res.status(200).json(RV)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getCreneauxDispos = async (req, res) => {
    try {
        const { id } = req.params
        const { date } = req.body
        const medecin = await userModel.findById(id);
        if (!medecin) {
            throw new Error("medecin introuvable");
        }

        const tousCreneaux = genererCreneaux(9, 17, 30);

        const debutJour = new Date(date);
        debutJour.setHours(0, 0, 0, 0);

        const finJour = new Date(date);
        finJour.setHours(23, 59, 59, 999);

        const RV = await rendezvousModel.find({
            medecin: medecin.id,
            date: { $gte: debutJour, $lte: finJour }
        })
        if (!RV) {
            throw new Error("aucun rendez-vous prevu");
        }

        const creneauxPris = RV.map(rv => rv.heureRV.trim().slice(0, 5));
        console.log("Creneaux pris :", creneauxPris);
        const creneauxLibres = tousCreneaux.filter(c => !creneauxPris.includes(c));
        res.status(200).json({ date, creneauxDisponibles: creneauxLibres });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.bloquerCreneauDispo = async (req, res) => {
    try {
        const { id, date, heureRV } = req.body
        const medecin = await userModel.findById(id);
        if (!medecin) {
            throw new Error("medecin introuvable");
        }

        const BlockedRV = await rendezvousModel.find({ medecin: medecin.id, date, heureRV, statutRV: "bloqué" })
        res.status(200).json(BlockedRV, "est non disponible ");
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.updateStatutRV = async (req, res) => {
    try {
        const { id } = req.params
        const { newStatut } = req.body
        const rendezVous = await rendezvousModel.findById(id)
        if (!rendezVous) {
            throw new Error("rendez-vous introuvable");
        }

        const updatedRV = await rendezvousModel.findByIdAndUpdate(
            id,
            {
                $set: { statutRV: newStatut }
            }
        )
        res.status(200).json(updatedRV)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.updateRV = async (req, res) => {
    try {
        const { id } = req.params
        const { dateRV, heureRV, patientId, medecinId } = req.body

        const rendezVous = await rendezvousModel.findById(id)
        if (!rendezVous) {
            throw new Error("rendez-vous introuvable");
        }

        const updatedRV = await rendezvousModel.findByIdAndUpdate(
            id,
            {
                $set: { dateRV, heureRV, patientId, medecinId }
            }
        )
        res.status(200).json(updatedRV)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.deleteRV = async (req, res) => {
    try {
        const { id } = req.params
        const RV = await rendezvousModel.findByIdAndDelete(id)
        if (!RV) {
            throw new Error("rendez-vous introuvable");
        }

         await userModel.updateMany({},{$pull: { rendezVous: RV._id }})

        res.status(200).json("rendez-vous supprimé avec succés")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}







