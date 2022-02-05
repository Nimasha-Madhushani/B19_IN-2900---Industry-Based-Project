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
    },
    teamID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
