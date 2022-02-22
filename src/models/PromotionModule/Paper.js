const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const Question = require("../../models/PromotionModule/Question");

//Details of paper created using questioons in question pool
const PaperSchema = new Schema({
    PaperID: {
        type: String,
        required: true,
        unique: true
    },
    PaperName: {
        type: String,
        required: true
    },
    PaperType: {
        type: String,
        required: true
    },
    DateCreated: {
        type: String,
        required: true
    },
    Questions: {
        type: Array,
        default: []
    }
});

const Paper = mongoose.model("Paper", PaperSchema);
module.exports = Paper;