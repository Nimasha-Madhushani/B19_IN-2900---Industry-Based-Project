const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    candidateID: {
      type: String,
      required: [true, "Please select a candidate"],
    },
    InterviewType: {
      type: String,
      required: [true, "Please select the interview type"],
    },
    InterviewDate: {
      type: Date,
      required: [true, "Please select a date for interview"],
    },
    Interviewers: {
      type: Array,
    },
    CandidateMarks: {
      type: Array,
      max: [100, "mark is Invalid"],
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("interviews", interviewSchema);
