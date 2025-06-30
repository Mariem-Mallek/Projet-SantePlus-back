const userModel= require("../models/Utilisateur")
const jwt= require('jsonwebtoken');

//Protection + securité des endPoints
const requireAuthUser = (req,res,next)=>{
    const token =  req.cookies.token;
    console.log("Token", token)
    if(token){
        jwt.verify(token,"secretKey",async (err,decodedToken)=>{
            if(err){
                res.json("Probleme token")
            }else{
                req.user = await userModel.findById(decodedToken.id)
                next();
            }
        })
    }else{
        res.json("Pas de token")
    }
}

module.exports={requireAuthUser}