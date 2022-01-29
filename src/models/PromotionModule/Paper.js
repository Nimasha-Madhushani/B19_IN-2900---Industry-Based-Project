const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Details of paper created using questioons in question pool
const PaperSchema = new Schema({
    PaperID: {
        type: String,
        required: true,
        unique: true
    },
    PaperType: {
        type: String,
        required: true
    },
    DateCreated: {
        type: String,
        required: true
    }
});

const Paper = mongoose.model("Paper", PaperSchema);
module.exports = Paper;