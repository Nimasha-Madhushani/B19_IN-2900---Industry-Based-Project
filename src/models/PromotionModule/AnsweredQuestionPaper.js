const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Ratings of employee and examinee to each question
const AnsweredQuestionPaperSchema = new Schema({
    PaperID: {
        type: String
    },
    EmployeeID: {
        type: String,
    },
    TeamLeadID: {
        type: String,
    },
    DateAttempted: {
        type: String
    },
    Questions: [{
        QuestionID: { type: String },
        QuestionBody : {type: String },
        EmployeeRating: { type: String },
        TeamLeadRating: { type: String }
    }],
    Feedback: {
        type: String
    },
    DateOfEvaluation: {
        type: String
    },
    isPromoted: {
        type: Boolean,
        default: false
    },
});

const AnsweredQuestionPaper = mongoose.model("AnsweredQuestionPaper", AnsweredQuestionPaperSchema);
module.exports = AnsweredQuestionPaper;