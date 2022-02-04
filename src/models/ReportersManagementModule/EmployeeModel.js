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
      // required: true,
    },
    streetNo: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      //required: true,
    },
    phoneNumber: {
      type: String,
     
      // default:"add mobile"
      // required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },
    NIC: {
      type: String,
      required: true,
      unique:true
    },
    companyEmail: {
      type: String,
      required: true,
      unique:true
    },
    status: {
      type: String,
      required: true,
    },
    /* joinDate: {
      type: String,
      required: true,
    },*/
    resignDate: {
      type: String,
      // required: true,
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
      //required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);
