const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: [true, "Please enter the product ID"],
  },
  productName: {
    type: String,
    required: [true, "Please enter the  eproduct name"],
  },
  description: {
    type: String,
    required: [true, "Please enter the description"],
  },
  recievedDate: {
    type: String,
    required: [true, "Please enter the recieved date"],
  },
  launchDate: {
    type: String,
    required: [true, "Please enter the launch date"],
  },
  teamID: {
    type: String,
    required: [true, "Please enter the team ID"],
  },
});

module.exports = mongoose.model("Product", productSchema);
