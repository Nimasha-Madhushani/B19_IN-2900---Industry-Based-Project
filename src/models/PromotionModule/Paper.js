const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Question = require("../../models/PromotionModule/Question");
//Details of paper created using questioons in question pool
const PaperSchema = new Schema({
    PaperID: {
        type: String,
        required: true,
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
        type: Date,
        required: true
    },
    Questions: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Question'
    }]
    //Questions: String
});

const Paper = mongoose.model("Paper", PaperSchema);
module.exports = Paper;