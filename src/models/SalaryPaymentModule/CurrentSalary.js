const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//current salary details of all employees for ongoing time period
const currentSalarySchema = new Schema({
    CurrentSalarySheetID: {
        type: String,
        required: true
        //unique: true
    },
    EmployeeID: {
        type: String,
        required: true
    },
    BasicSalary: {
        type: Number,
        required: true
    },
    VehicleAllowance: {
        type: Number,
        required: true
    },
    InternetAllowance: {
        type: Number,
        required: true
    },
    EmoloyeeEpf: {
        type: Number,
        required: true
    },
    NetSalary: {
        type: Number,
        required: true
    },
    CompanyEPF: {
        type: Number,
        required: true
    },
    ETF: {
        type: Number,
        required: true
    }
});

const currentSalary = mongoose.model("currentSalary", currentSalarySchema);
module.exports = currentSalary;