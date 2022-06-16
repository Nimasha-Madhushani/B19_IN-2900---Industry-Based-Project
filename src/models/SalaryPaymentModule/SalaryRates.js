const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//current salary details of all employees for ongoing time period
const salaryRatesSchema = new Schema({

    ChangedDate: {
        type: String,
        required: true
    },
    ChangedBY: {
        type: String,
        required: true,
    },
    EmoloyeeEpfRate: {
        type: Number,
        required: true
    },
    CompanyEPFRate: {
        type: Number,
        required: true
    },
    ETFRate: {
        type: Number,
        required: true
    }
});

const salaryRates = mongoose.model("salaryRates", salaryRatesSchema);
module.exports = salaryRates;