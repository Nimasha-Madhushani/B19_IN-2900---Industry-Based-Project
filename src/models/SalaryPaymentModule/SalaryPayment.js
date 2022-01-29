const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//summary of salary details of all employees for total time period
const salaryPaymentSchema = new Schema({
    SalarySheetID: {
        type: String,
        required: true,
        unique: true
    },
    EmployeeID: {
        type: String,
        required: true
    },
    Year: {
        type: Date,
        required: true
    },
    Month: {
        type: Date,
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

const salaryPayment = mongoose.model("salaryPayment", salaryPaymentSchema);
module.exports = salaryPayment;