const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Details of Questions created in Question pool
const QuestionSchema = new Schema({
    QuestionID: {
        type: String,
        required: true,
        unique: true
    },
    QuestionBody: {
        type: String,
        required: true
    }
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;