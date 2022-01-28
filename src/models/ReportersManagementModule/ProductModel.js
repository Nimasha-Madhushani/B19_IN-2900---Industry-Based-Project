const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  recievedDate: {
    type:Date,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
    default:null
  },
  teamID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
