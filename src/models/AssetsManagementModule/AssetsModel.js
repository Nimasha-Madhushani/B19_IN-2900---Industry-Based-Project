const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assetsSchema = new Schema({
    assetID :{
        type : String,
        required : true,
        unique:true
    },
    assetCategory :{
        type : String,
        required : true
    },
    model :{
        type : String,
        required : true
    },
    serialNumber : {
        type : String,
        required : true
    },
    status :{
        type : String,
        required : true,
        default : 'Available'
    }
});

const Asset = mongoose.model("Asset",assetsSchema);
module.exports = Asset;