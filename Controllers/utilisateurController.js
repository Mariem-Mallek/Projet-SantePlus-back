const userModel= require("../models/Utilisateur")
const bcrypt= require("bcrypt")

module.exports.addPatient=async(req,res)=>{
    try{
        const {nom,prenom,dateNaiss,email,mdp,sexe,poids,taille}=req.body
        const rolePatient = "patient"
        const user = new userModel({
            nom,prenom,dateNaiss,email,mdp,sexe,poids,taille,role:rolePatient
        })
        const patientAdded = await user.save()
        res.status(200).json(patientAdded)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.addMedecin=async(req,res)=>{
    try{
        const {nom,prenom,dateNaiss,email,mdp,numProfessionnel,specialite,ville,adresse}=req.body
        const roleMedecin = "medecin"
        const user = new userModel({
            nom,prenom,dateNaiss,email,mdp,numProfessionnel,specialite,ville,adresse,role:roleMedecin
        })
        const medecinAdded = await user.save()
        res.status(200).json(medecinAdded)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.addAdmin=async(req,res)=>{
    try{
        const {nom,prenom,email,mdp,dateEmbauche}=req.body
        const roleAdmin = "admin"
        const user = new userModel({
            nom,prenom,email,mdp,dateEmbauche,role:roleAdmin
        })
        const adminAdded = await user.save()
        res.status(200).json(adminAdded)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.addPatientWithImg=async(req,res)=>{
    try{
        const userData={...req.body}
        userData.role = "patient"

        if(req.file){
            const{filename}=req.file;
            userData.image=filename
        }

        const user = new userModel(
           userData
        )

        const patientAdded = await user.save()
        res.status(200).json(patientAdded)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.addMedecinWithImg=async(req,res)=>{
    try{
        const userData={...req.body}
        userData.role = "medecin"

        if(req.file){
            const{filename}=req.file;
            userData.image=filename
        }

        const user = new userModel(
           userData
        )

        const medecinAdded = await user.save()
        res.status(200).json(medecinAdded)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.addAdminWithImg=async(req,res)=>{
    try{
        const userData={...req.body}
        userData.role = "admin"

        if(req.file){
            const{filename}=req.file;
            userData.image=filename
        }

        const user = new userModel(
           userData
        )

        const adminAdded = await user.save()
        res.status(200).json(adminAdded)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}


module.exports.getAllUsers = async(req,res)=>{
    try{
        //const userList = await userModel.find({dateNaiss:{$gt:2008-4-2}}).sort("dateNaiss").limit(2)
        const userList = await userModel.find().sort({dateNaiss:-1})
        if(userList.length==0){
                throw new Error("utilisateur introuvable");
        }
        res.status(200).json(userList)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}


module.exports.getUserById = async(req,res)=>{
    try{
        const {id} = req.params
        const user=await userModel.findById(id)
        if(!user){
                throw new Error("utilisateur introuvable");
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.getUserByEmail = async(req,res)=>{
    try{
        const {email} = req.body
        const user=await userModel.find({email:email})
        if(!user){
                throw new Error("utilisateur introuvable");
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}

module.exports.updateUser = async(req,res)=>{
    try{
        const {id} = req.params
        const{nom,prenom,email}=req.body
        const user = await userModel.findById(id)
        if(!user){
                throw new Error("utilisateur introuvable");
        }

        const updatedUser= await userModel.findByIdAndUpdate(
            id,
            {
                $set:{nom,prenom,email}
            }
        )
        res.status(200).json(updatedUser)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}


module.exports.updateMdp = async(req,res)=>{
    try{
        const {id} = req.params
        const{newMdp}=req.body
        const user = await userModel.findById(id)
        if(!user){
                throw new Error("utilisateur introuvable");
        }

        const salt = await bcrypt.genSalt()

        const isSameMdp= await bcrypt.compare(newMdp,user.mdp)

        const newMdpHachee = await bcrypt.hash(newMdp,salt)

        if(isSameMdp){
            throw new Error("Veuillez saisir un mdp different au mdp actuel !")
        }

        const updatedUser= await userModel.findByIdAndUpdate(
            id,
            {
                $set:{mdp:newMdpHachee}
            }
        )
        res.status(200).json(updatedUser)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}


module.exports.deleteUserById = async(req,res)=>{
    try{
        const {id} = req.params
        const user=await userModel.findByIdAndDelete(id)
        if(!user){
                throw new Error("utilisateur introuvable");
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}




