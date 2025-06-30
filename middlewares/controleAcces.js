const controleAcces = async(req,res,next)=>{
    if(req.user.role==="admin"){
        next();
    }else{
        res.status(401).json("vous n'etes pas priviligé pour l'acces")

    }
}

module.exports={controleAcces}