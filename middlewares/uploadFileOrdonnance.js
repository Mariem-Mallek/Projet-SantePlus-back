const multer =require("multer");
const path = require("path");
const fs= require("fs");  // File System

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/PDF/ordonnanceFiles')
    },

    filename:function(req,file,cb){
        const uploadPath='public/PDF/ordonnanceFiles';
        const originalName=file.originalname;
        console.log("Nom original du fichier : " ,file.originalname)
        const fileExtension = path.extname(originalName);
        let fileName=originalName;

        //Verification si le fichier existe
        let fileIndex=1;
        while(fs.existsSync(path.join(uploadPath,fileName))){
            const baseName=path.basename(originalName,FileExtension);
            fileName=`${baseName}_${fileIndex}${fileExtension}`;
             fileIndex++
        }
        cb(null,fileName)
    }
})

var uploadFile= multer({storage:storage});
module.exports=uploadFile;