const mongoose = require("mongoose");
const FileSchema = new mongoose.Schema({
    originalname: String,
    filename: String,
    path: String,
});
var filedb = new mongoose.model("files",FileSchema);

module.exports = filedb;