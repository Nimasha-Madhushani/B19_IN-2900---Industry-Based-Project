const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema(
  {
    employeeFirstName: {
      type: String,
      required: [true, "Please enter the first name"],
    },
    employeeLastName: {
      type: String,
      required: [true, "Please enter the last name"],
    },
    birthday: {
      type: String,
      required: [true, "Please enter the birthday"],
    },
    streetNo: {
      type: String,
      required: [true, "Please enter the street number"],
    },
    city: {
      type: String,
      required: [true, "Please enter the city"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter the phone number"],
      unique: true,
    },
    jobRole: {
      type: String,
      required: [true, "Please enter the job role"],
    },
    NIC: {
      type: String,
      required: [true, "Please enter the NIC"],
    },

    companyEmail: {
      type: String,
      required: [true, "Please enter the phone number"],
      unique: true,
      validate: [validator.isEmail, "please enter a valid email"],
    },
    status: {
      type: String,
      required: [true, "Please enter the status"],
    },
    lastLogin: {
      type: String,
      required: [true, "Please enter the last login"],
    },
    joinDate: {
      type: String,
      required: [true, "Please enter the join date"],
    },
    resignDate: {
      type: String,
      required: [true, "Please enter the resign date"],
    },
    jobType: {
      type: String,
      required: [true, "Please enter the job type"],
    },
    candidateID: {
      type: String,
      required: [true, "Please enter the candidtae ID"],
    },
    teamID: {
      type: String,
      required: [true, "Please enter the team ID"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);
