const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//exam schedule model
const ExamSchema = new Schema({

    organizerID: {
        type: String,
        required: true,
    },
    ExamID: {
        type: String,
        required: true
    },
    ExamName: {
        type: String,
        required: true
    },
    DateCreated: {
        type: String,
        required: true
    },
    DateScheduled: {
        type: String,
        required: true
    },
    PaperID: {
        type: String,
        required: true,
    },
    JobRole: {
        type: String,
        required: true
    },
});

const Exam = mongoose.model("Exam", ExamSchema);
module.exports = Exam;
