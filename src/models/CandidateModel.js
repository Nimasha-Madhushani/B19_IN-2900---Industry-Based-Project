const mongoose = require("mongoose");
const validator = require('validator');


const candidateSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: [true, "Please enter the candidate name"],
    },
    phoneNumber: {
        type : String,
        required:[true, "Please enter the phone number"],
        unique:true
    },
    email: {
        type:String,
        required:[true, "Please enter the phone number"],
        unique:true,
        validate: [validator.isEmail, "please enter a valid email"]
    },
    cv: {
      type: String,
      required: [true, "Please input the cv"],
    },
    marks: {
        type: Number,
        max:[100, "Invalid input"]
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('candidate', candidateSchema);
