const userModel = require("../models/Utilisateur")
const rendezvousModel = require("../models/RendezVous");
const ordonnanceModel = require("../models/Ordonnance");
const interactionModel = require("../models/Interaction");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


module.exports.addPatient = async (req, res) => {
    try {
        const { nom, prenom, dateNaiss, email, mdp, numTel} = req.body
        const rolePatient = "patient"
        const user = new userModel({
            nom,
            prenom,
            dateNaiss,
            email,
            mdp,
            numTel,
            role: rolePatient
        })
        const patientAdded = await user.save()
        res.status(200).json(patientAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.addMedecin = async (req, res) => {
    try {
        const { nom, prenom, dateNaiss, email, mdp, numProfessionnel, specialite, ville } = req.body
        const roleMedecin = "medecin"
        const user = new userModel({
            nom,
            prenom,
            dateNaiss,
            email,
            mdp,
            numProfessionnel,
            specialite,
            ville,
            role: roleMedecin
        })
        const medecinAdded = await user.save()
        res.status(200).json(medecinAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.addAdmin = async (req, res) => {
    try {
        const { nom, prenom, email, mdp, dateEmbauche } = req.body
        const roleAdmin = "admin"
        const user = new userModel({
            nom,
            prenom,
            email,
            mdp,
            dateEmbauche,
            role: roleAdmin
        })
        const adminAdded = await user.save()
        res.status(200).json(adminAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.addPatientWithImg = async (req, res) => {
    try {
        const userData = { ...req.body }
        userData.role = "patient"

        if (req.file) {
            const { filename } = req.file;
            userData.image = filename
        }

        const user = new userModel(
            userData
        )

        const patientAdded = await user.save()
        res.status(200).json(patientAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.addMedecinWithImg = async (req, res) => {
    try {
        const userData = { ...req.body }
        userData.role = "medecin"

        if (req.file) {
            const { filename } = req.file;
            userData.image = filename
        }

        const user = new userModel(
            userData
        )

        const medecinAdded = await user.save()
        res.status(200).json(medecinAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.addAdminWithImg = async (req, res) => {
    try {
        const userData = { ...req.body }
        userData.role = "admin"

        if (req.file) {
            const { filename } = req.file;
            userData.image = filename
        }

        const user = new userModel(
            userData
        )

        const adminAdded = await user.save()
        res.status(200).json(adminAdded)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getAllUsers = async (req, res) => {
    try {
        //const userList = await userModel.find({dateNaiss:{$gt:2008-4-2}}).sort("dateNaiss").limit(2)
        const userList = await userModel.find().sort({ dateNaiss: -1 })

        const user = req.user
        console.log(user)

        if (userList.length == 0) {
            throw new Error("utilisateur introuvable");
        }
        res.status(200).json(userList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        if (!user) {
            throw new Error("utilisateur introuvable");
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.find({ email: email })
        if (!user) {
            throw new Error("utilisateur introuvable");
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.getMedecinsByLocalisation = async (req, res) => {
    try {
        const medecins = await userModel.find({ role: 'medecin' },
            'nom prenom specialite latitude longitude ville adresse image'
        );

        res.status(200).json(medecins)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { nom, prenom, email } = req.body
        const user = await userModel.findById(id)
        if (!user) {
            throw new Error("utilisateur introuvable");
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            {
                $set: { nom, prenom, email }
            }
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.updateLocalisation = async (req, res) => {
    try {
        const { id } = req.params
        const { latitude, longitude } = req.body;

        const updatedMedecin = await userModel.findByIdAndUpdate(
            id,
            {
                $set: { latitude, longitude }
            }
        )

        if (!updatedMedecin) {
            return res.status(404).json({ message: "Médecin introuvable" });
        }

        res.status(200).json(updatedMedecin)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.updateMdp = async (req, res) => {
    try {
        const { id } = req.params
        const { newMdp } = req.body
        const user = await userModel.findById(id)
        if (!user) {
            throw new Error("utilisateur introuvable");
        }

        const salt = await bcrypt.genSalt()

        const isSameMdp = await bcrypt.compare(newMdp, user.mdp)

        const newMdpHachee = await bcrypt.hash(newMdp, salt)

        if (isSameMdp) {
            throw new Error("Veuillez saisir un mdp different au mdp actuel !")
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            {
                $set: { mdp: newMdpHachee }
            }
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findByIdAndDelete(id)
        if (!user) {
            throw new Error("utilisateur introuvable");
        }

        // Suppression des rendez-vous
        await rendezvousModel.deleteMany({
            $or: [
                { patient: id },
                { medecin: id }
            ]
        });

        // Suppression des ordonnances
        await ordonnanceModel.deleteMany({
            $or: [
                { patient: id },
                { medecin: id }
            ]
        });

        // Suppression des interactions
        await interactionModel.deleteMany({
            $or: [
                { patient: id },
                { medecin: id }
            ]
        });
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const createToken = (id) => {
    return jwt.sign({ id },
        "secretKey",
        { expiresIn: "1h" }
    )
}


module.exports.loginUser = async (req, res) => {
    try {
        const { email, mdp } = req.body
        const user = await userModel.login(email, mdp)

        const token = createToken(user._id);
        await userModel.findByIdAndUpdate({ _id: user._id },
            { connected: true }
        )
        res.cookie("token", token, {
            httpOnly: true,    // protégé des scripts JS (XSS)
            maxAge: 60000    // durée du cookie en ms 
        });

        res.status(200).json({
            message: "Authentification vérifiée",
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        const user = req.user; // récupéré depuis ton middleware auth

        if (!user) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const updatedUser = await userModel.findByIdAndUpdate({ _id: user._id }, { connected: false })
        res.cookie("token", "", {
            httpOnly: true,    // protégé des scripts JS (XSS)
            maxAge: 1
        });

        res.status(200).json({ message: "déconnexion vérifiée" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




