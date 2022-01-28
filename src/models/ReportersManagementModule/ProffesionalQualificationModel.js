const mongoose = require("mongoose");

const proffesionalQualificaationSchema = new mongoose.Schema({
  proffesionalQualificationID: {
    type: String,
    required: true
  },
  employeeID: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model(
  "proffesionalQualification",
  proffesionalQualificaationSchema
);
