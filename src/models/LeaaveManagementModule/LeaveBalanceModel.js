const mongoose = require('mongoose');


const leaveBalanceSchema = new mongoose.Schema({
    entitledAnnualLeave: {
        type : Number,
        required : true
    },
    entitledCasualLeave : {
        type : Number,
        required : true
    },
    entitledMedicalLeave : {
        type : Number,
        required : true
    },
    approvedAnnualLeave : {
        type : Number,
        required : true
    },
    approvedCasualLeave : {
        type : Number,
        required : true
    },
    approvedMedicalLeave : {
        type : Number,
        required : true
    },
    employeeId : {
        type : String,
        required : true
    }
   

})


module.exports = mongoose.model("LeaveBalances",leaveBalanceSchema);