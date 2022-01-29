const mongoose = require("mongoose");

const academicQualificaationSchema = new mongoose.Schema({
  /*academicQualificationID: {
    type: String,
    required:true
  },*/
  employeeID: {
    type: String,
    required: true
  },

  ordinaryLevelResult: {
    type: Array,
    required: true
  },
  advancedLevelResults: {
    type: Array,
    required: true
  },

  achievements: {
    type:Array,
    required: true
  },
});

module.exports = mongoose.model("academicQualification",academicQualificaationSchema);
