const controleAcces = async(req,res,next)=>{
    if(req.user.role==="admin"){
        next();
    }else{
        res.status(401).json("Accès refusé : vous n'etes pas priviligé pour l'accès !")
    }
}

module.exports={controleAcces}