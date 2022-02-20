const mongoose = require("mongoose");

//summary of salary details of all employees for total time period
const summarySalarySchema = new mongoose.Schema({

    EmployeeID: {
        type: String,
        required: true
    },
    Year: {
        type: Number,
        required: true
    },
    Month: {
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
}
)
    ;

const summarySalary = mongoose.model("SummarySalarySchema", summarySalarySchema);
module.exports = summarySalary; 