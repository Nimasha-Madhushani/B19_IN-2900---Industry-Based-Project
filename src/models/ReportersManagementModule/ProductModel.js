const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
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
      type: String,
      //required: true,
    },

  /*  launchDate: {
      type: String,
      //required: true,
    },*/
    teamID: {
      type: String,
     // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
