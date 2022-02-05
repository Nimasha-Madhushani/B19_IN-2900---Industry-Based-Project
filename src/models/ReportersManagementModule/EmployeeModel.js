const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
    },
    employeeID: {
      type: String,
      required: true,
    },
    employeeFirstName: {
      type: String,
      required: true,
    },
    employeeLastName: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
    },
    streetNo: {
      type: String,
    },
    city: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },

    jobRole: {
      type: String,
      required: true,
    },
    NIC: {
      type: String,
      required: true,
      unique: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },

    resignDate: {
      type: String,
    },
    jobType: {
      type: String,
      required: true,
    },
    candidateID: {
      type: String,
      required: true,
    },
    teamID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);
