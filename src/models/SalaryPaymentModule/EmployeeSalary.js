const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//salary details for current month of all employees
const employeeSalarySchema = new Schema({
    CuurrentSalarySheetID: {
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

const employeeSalary = mongoose.model("employeeSalary", employeeSalarySchema);
module.exports = employeeSalary;