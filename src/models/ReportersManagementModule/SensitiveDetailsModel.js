const mongoose = require("mongoose");

const sensitiveDetailsSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    /* accessLevel: {
    type: String,
    required: true
  },*/
    password: {
      type: String,
      required: true,
    },
    employeeID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SensitiveDetails", sensitiveDetailsSchema);
