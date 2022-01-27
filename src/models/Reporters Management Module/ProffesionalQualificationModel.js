const mongoose = require("mongoose");

const proffesionalQualificaationSchema = new mongoose.Schema({
  proffesionalQualificationID: {
    type: String,
    required: [true, "Please enter the proffesional qualification ID"],
  },
  employeeID: {
    type: String,
    required: [true, "Please enter the  employee ID"],
  },
  degree: {
    type: String,
    required: [true, "Please enter the degree"],
  },
  language: {
    type: String,
    required: [true, "Please enter the language"],
  },
  course: {
    type: String,
    required: [true, "Please enter the course"],
  },
});

module.exports = mongoose.model(
  "proffesionalQualification",
  proffesionalQualificaationSchema
);
