const mongoose = require("mongoose")

module.exports.connectToMongoDB = async()=>{
    mongoose.set("strictQuery",false)  //Pour les injections
    mongoose.connect(process.env.UrlDB).then(
        ()=>{
            console.log("connection à ma BD ")
        }
    ).catch(
        (err)=>{
            console.log(err.message)
        }
    )
}