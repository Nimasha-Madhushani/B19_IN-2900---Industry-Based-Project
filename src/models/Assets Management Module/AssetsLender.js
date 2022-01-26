const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assetsSchema = new Schema({
    assignDate :{
        type : String,
        required : true
    },
    assetID :{
        type : String,
        required : true
    },
    employeeID :{
        type : String,
        required : true
    }
});

const AssetLender = mongoose.model("Asset Lender",assetsSchema);
module.exports = AssetLender;