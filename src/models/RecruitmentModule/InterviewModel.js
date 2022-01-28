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
    InterviewTime: {
      type: String,
      required: [true, "Please select a time for interview"],
    },
    InterviewerID: {
      type: Array,
    },
    CandidateMarks: {
      type: Array,
      max: [100, "mark is Invalid"],
    },
  },
  { timestamps: true }
);

// interviewSchema.prependListener('save', function(next){
//   const userInput = this.InterviewTime;
//    const hours = userInput.slice(0, 2);
//    const minutes = userInput.slice(3);

//    const date = new Date(dateString);
//    date.setHours(hours, minutes);

//    next();
// })

module.exports = mongoose.model("interviews", interviewSchema);
