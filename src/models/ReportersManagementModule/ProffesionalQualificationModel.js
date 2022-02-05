const mongoose = require("mongoose");

const proffesionalQualificaationSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
    },
    degree: {
      type: Array,
      required: true,
    },
    language: {
      type: Array,
      required: true,
    },
    course: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "proffesionalQualification",
  proffesionalQualificaationSchema
);
