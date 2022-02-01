const leave = require("../../models/LeaaveManagementModule/LeaveModel")
const leave_balance = require("../../models/LeaaveManagementModule/LeaveBalanceModel");
const LeaveModel = require("../../models/LeaaveManagementModule/LeaveModel");

exports.requestLeave = async (req,res) => {
    const leaveType = req.body.leaveType;
    const reason = req.body.reason;
    const sDate = req.body.startDate;
    const eDate = req.body.endDate;
    const status = req.body.status;
    const leaveMethod = req.body.leaveMethod;
    const empId = req.body.employeeId



    const newLeave = new leave({
        leaveType,reason,sDate,eDate,status,leaveMethod,empId
    })
    
    
    await newLeave.save().then(()=>{
        res.json("Your leave request is succesfully completed")
    }).catch((err)=>{
        res.status(400).json({ message: "Leave Request is not completed" });
    })
};



exports.rejectOrApprove = async (req, res) => {
    try {
        const findLeave = await LeaveModel.findById(req.body.id);
       
        if (!findLeave) {
            return res.status(400).send({status:"Leave request not found" })
        } else if (findLeave) {
            if (req.body.status === 'Approved') {
                await sendMail();
            } else {
                await sendMail();
            }
            findLeave.status = req.body.status;
            await findLeave.save();
            return res.status(200).send({status:"Leave request is succesfully updated" })
        }
    } catch (error) {
        res.status(400).json({
          success: false,
          description: "leave request is not succesfully considered",
          error: error.message,
        });
    }

};