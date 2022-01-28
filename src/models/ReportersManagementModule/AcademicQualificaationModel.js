const mongoose = require("mongoose");

const academicQualificaationSchema = new mongoose.Schema({
  academicQualificationID: {
    type: String,
    required:true
  },
  employeeID: {
    type: String,
    required: true
  },

  ordinaryLevelResult: {
    type: String,
    required: true
  },
  advancedLevelResults: {
    type: String,
    required: true
  },

  achievements: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("academicQualification",academicQualificaationSchema);
