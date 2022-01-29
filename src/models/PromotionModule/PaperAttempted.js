const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Details of paper attempts by employee
const PaperAttemptedSchema = new Schema({
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
    DateAttempted: {
        type: String,
        required: true
    }
});

const PaperAttempted = mongoose.model("PaperAttempted", PaperAttemptedSchema);
module.exports = PaperAttempted;