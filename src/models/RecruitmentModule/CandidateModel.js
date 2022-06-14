const mongoose = require("mongoose");
const validator = require("validator");

const candidateSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: [true, "Please enter the candidate name"],
    },
    NIC: {
      type: String,
      required: [true, "Please enter the candidate NIC"],
      unique:true
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter the phone number"],
      unique: true,
    },
    appliedPosition : {
      type: String,
      required: [true, "Please select the applied position"],
    },
    email: {
      type: String,
      required: [true, "Please enter the phone number"],
      unique: true,
      validate: [validator.isEmail, "please enter a valid email"],
    },
    cv: {
      type: String,
      required: [true, "Please input the cv"],
    },
    status: {
      type: String,
      default: "Initiated"
    }            // Recruited/ Rejected/ Initiated/ Scheduled/ Hold / Passed 1st / Selected
  },
  { timestamps: true }
);

module.exports = mongoose.model("candidates", candidateSchema);
