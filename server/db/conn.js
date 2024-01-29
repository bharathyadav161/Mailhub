const mongoose = require("mongoose");
const database="mongodb+srv://bharath:bharath@cluster0.ixlymjb.mongodb.net/?retryWrites=true&w=majority";
//const database = "mongodb+srv://bharath:bharath@cluster0.ixlymjb.mongodb.net/";
//mongodb+srv://<username>:<password>@cluster0.jbuq2dl.mongodb.net/
mongoose.connect(database,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("database connected")).catch((err)=>console.log("errr",err))