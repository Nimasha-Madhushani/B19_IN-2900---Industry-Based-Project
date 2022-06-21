const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: [true, "Please enter the employee ID"],
    },
    evaluatorID: {
      type: String,
      required: [true, "Please enter the evaluator ID"],
    },
    promotedDate: {
      type: Date,
      required: [true, "Please enter the Promoted Date"],
    },
    newPosition : {
      type: String,
      required: [true, "Please select the new Position"],
    },
    previousPosition: {
      type: String,
      required: [true, "Please enter the previous Position"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("promotion", promotionSchema);
