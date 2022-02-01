const mongoose = require('mongoose');


const leaveBalanceSchema = new mongoose.Schema({
    entitledAnnualLeave: {
        type : Number,
        required : true, default:14
    },
    entitledCasualLeave : {
        type : Number,
        required : true, default:7
    },
    entitledMedicalLeave : {
        type : Number,
        required : true, default:7
    },
    approvedAnnualLeave : {
        type : Number,
        required : true, default:0
    },
    approvedCasualLeave : {
        type : Number,
        required : true, default:0
    },
    approvedMedicalLeave : {
        type : Number,
        required : true, default:0
    },
    employeeId : {
        type : String,
        required : true
    }
   

})


module.exports = mongoose.model("LeaveBalances",leaveBalanceSchema);