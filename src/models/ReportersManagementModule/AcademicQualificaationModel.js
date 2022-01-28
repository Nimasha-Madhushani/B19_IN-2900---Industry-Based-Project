const mongoose = require("mongoose");

const academicQualificaationSchema = new mongoose.Schema({
  academicQualificationID: {
    type: String,
    required: [true, "Please enter the academic qualification ID"],
  },
  employeeID: {
    type: String,
    required: [true, "Please enter the  employee ID"],
  },

  ordinaryLevelResult: {
    type: String,
    required: [true, "Please enter the O/L Result"],
  },
  advancedLevelResults: {
    type: String,
    required: [true, "Please enter the A/L Results"],
  },

  achievements: {
    type: String,
    required: [true, "Please enter the acheivement"],
  },
});

module.exports = mongoose.model("academicQualification",academicQualificaationSchema);
