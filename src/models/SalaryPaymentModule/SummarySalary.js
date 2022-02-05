const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
//const CurrentSheet = require("../../models/SalaryPaymentModule/CurrentSalary");

//summary of salary details of all employees for total time period
const summarySalarySchema = new mongoose.Schema({
    // CurrentSalarySheetID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true,
    // },
    // EmployeeID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // },
    // // Year: {
    // //     type: String,
    // //     required: true
    // // },
    // // Month: {
    // //     type: String,
    // //     required: true
    // // },
    // BasicSalary: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // },
    // VehicleAllowance: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // },
    // InternetAllowance: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // },
    // EmoloyeeEpf: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // },
    // NetSalary: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // },
    // CompanyEPF: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheetcurrentSalary',
    //     required: true
    // },
    // ETF: {
    //     type: mongoose.Schema.Types.number,
    //     ref: 'CurrentSheet.currentSalary',
    //     required: true
    // }


    CurrentSalarySheetID: {
        type: String,
        // required: true
    },
    EmployeeID: {
        type: String,
        // required: true
    },
    Year: {
        type: Number,
        //  required: true
    },
    Month: {
        type: Number,
        // required: true
    },
    BasicSalary: {
        type: Number,
        // required: true
    },
    VehicleAllowance: {
        type: Number,
        // required: true
    },
    InternetAllowance: {
        type: Number,
        // required: true
    },
    EmoloyeeEpf: {
        type: Number,
        // required: true
    },
    NetSalary: {
        type: Number,
        // required: true
    },
    CompanyEPF: {
        type: Number,
        //  required: true
    },
    ETF: {
        type: Number,
        // required: true
    }
});

const summarySalary = mongoose.model("SummarySalarySchema", summarySalarySchema);
module.exports = summarySalary; //