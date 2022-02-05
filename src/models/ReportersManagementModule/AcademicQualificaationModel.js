const mongoose = require("mongoose");

const academicQualificaationSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
    },

    ordinaryLevelResult: {
      type: Array,
      required: true,
    },
    advancedLevelResults: {
      type: Array,
      required: true,
    },

    achievements: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "academicQualification",
  academicQualificaationSchema
);
