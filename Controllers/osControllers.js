const os = require("os")

module.exports.getOsInfos= async (req,res)=>{
     try{
            const osInfos ={
                hostname: os.hostname(),
                type: os.type(),
                platform: os.platform()
            }
            if(!osInfos){
                throw new Error("il n'y a aucune info sur votre pc");
            }
            res.status(200).json(osInfos);
        }catch(error){
            res.status(500).json(error.message);
        }
}


module.exports.osCpus= async (req,res)=>{
     try{
            const osCpu = os.cpus();
            res.status(200).json(osCpu);
        }catch(error){
            res.status(500).json(error.message);
        }
}


module.exports.osCpusById= async (req,res)=>{
     try{
            const {id} = req.params;        
            //const id = req.params.id;
            console.log("params",id);
    

            //const {idd} = req.body;
            //console.log("body",idd);
            

            //const {iddd,name} = req.query
            //console.log("query",iddd);
            //console.log("query",name);

            const osCpu = os.cpus();

            if(!osCpu){
                throw new Error("cpu introuvable");
            }

            if(id <0 || id>osCpu.length-1){
                throw new Error("id invalide");
            }
            res.status(200).json(osCpu[id]);
        }catch(error){
            res.status(500).json(error.message);
        }
}
       
