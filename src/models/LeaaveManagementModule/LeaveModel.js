const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema ({
    leaveType : {
        type : String,
        required : [true, "Please select leave type"]
    },
    reason : {
        type : String,
        required : [true, "Please enter reason"]
    },
    startDate : {
        type : Date,
        required : [true, "please select the date"]
    },
    EndDate : {
        type : Date,
        required : [true, "please select the endDate"]
    },
    status : {
        type : String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending"
        
    },
    leaveMethod : {
        type : String,
        required : [true, "please select the leave method"]
    },
    employeeId : {
        type : String,
        required : true
    }
   

})

module.exports = mongoose.model("Leaves",leaveSchema);;