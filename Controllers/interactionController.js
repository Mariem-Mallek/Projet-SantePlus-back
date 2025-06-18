const interactionModel = require("../models/Interaction")
const userModel = require("../models/Utilisateur")


module.exports.addInteraction = async (req, res) => {
    try {
        const { typeInteraction, contenuInteraction, patientId, medecinId } = req.body

        const patient = await userModel.findById(patientId);
        if (!patient) {
            throw new Error("patient introuvable");
        }

        const medecin = await userModel.findById(medecinId);
        if (!medecin) {
            throw new Error("medecin introuvable");
        }

        const interaction = new interactionModel({
            typeInteraction,
            contenuInteraction,
            patient: patient.id,
            medecin: medecin.id
        })
        const savedInteraction = await interaction.save()
        res.status(200).json(savedInteraction)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports.getAllInteractions = async (req, res) => {
    try {
        const { patientId, medecinId } = req.body;

        const patient = await userModel.findById(patientId);
        if (!patient) {
            throw new Error("patient introuvable");
        }

        const medecin = await userModel.findById(medecinId);
        if (!medecin) {
            throw new Error("medecin introuvable");
        }

        const interactions = await interactionModel.find({
            patient: patientId,
            medecin: medecinId
        }).sort({ createdAt: -1 });

        res.status(200).json(interactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports.updateInteraction = async(req,res)=>{
    try{
        const {id} = req.params
        const{contenuInteraction}=req.body
        const interaction = await interactionModel.findById(id)
        if(!interaction){
                throw new Error("interaction introuvable");
        }

        const updatedInteraction= await interactionModel.findByIdAndUpdate(
            id,
            {
                $set:{contenuInteraction}
            }
        )
        res.status(200).json(updatedInteraction)
    }catch(error){
        res.status(500).json({message : error.message})
    }
}


module.exports.deleteInteraction = async(req,res)=>{
    try{
        const {id} = req.params
        const interaction=await interactionModel.findByIdAndDelete(id)
        if(!interaction){
                throw new Error("interaction introuvable");
        }
        res.status(200).json("interaction supprimée avec succés")
    }catch(error){
        res.status(500).json({message : error.message})
    }
}