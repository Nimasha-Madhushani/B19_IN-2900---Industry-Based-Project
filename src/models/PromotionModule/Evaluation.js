const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Feedback given to each paper written by Employee
const EvaluationSchema = new Schema({
    TeamLeadID: {
        type: String,
        required: true,
        unique: true
    },
    PaperID: {
        type: String,
        required: true,
        unique: true
    },
    EmployeeID: {
        type: String,
        required: true,
        unique: true
    },
    Feedback: {
        type: String,
        required: true
    }
});

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);
module.exports = Evaluation;