const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Ratings of employee and examinee to each question
const AnsweredQuestionPaperSchema = new Schema({
    PaperID: {
        type: String,
        required: true,
        unique: true
    },
    QuestionID: {
        type: String,
        required: true,
        unique: true
    },
    UserRating: {
        type: String,
        required: true
    },
    PanelRating: {
        type: String,
        required: true
    }
});

const AnsweredQuestionPaper = mongoose.model("AnsweredQuestionPaper", AnsweredQuestionPaperSchema);
module.exports = AnsweredQuestionPaper;