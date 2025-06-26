const multer =require("multer");
const path = require("path");
const fs= require("fs");  // File System

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/PDF/assuranceFiles')
    },

    filename:function(req,file,cb){
        const uploadPath='public/PDF/assuranceFiles';
        const originalName=file.originalname;
        console.log("Nom original du fichier : " ,file.originalname)
        const fileExtension = path.extname(originalName);
        let fileName=originalName;

        //Verification si le fichier existe
        let fileIndex=1;
        while(fs.existsSync(path.join(uploadPath,fileName))){
            const baseName=path.basename(originalName,fileExtension);
            fileName=`${baseName}_${fileIndex}${fileExtension}`;
             fileIndex++
        }
        cb(null,fileName)
    }
})

const uploadFile = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        // Vérification que le fichier est un PDF
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite à 5MB
    }
});

module.exports=uploadFile;