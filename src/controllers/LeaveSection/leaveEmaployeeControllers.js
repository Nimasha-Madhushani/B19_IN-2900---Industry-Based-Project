const mongoose = require('mongoose');
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const LeaveSchema = require("../../models/LeaveManagementModule/LeaveModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel")
const leaveBalanceSchema = require('../../models/LeaveManagementModule/LeaveBalanceModel');
const sendEmails = require("./mailHandler");



module.exports.requestLeave = async (req, res) => {
  const {
    leaveType,
    reason,
    startDate,
    endDate,
    leaveMethod,
    employeeId,
  } = req.body;
  try {
    //console.log("hi");
    const newLeave = new LeaveSchema({
      leaveType,
      reason,
      startDate,
      endDate,
      leaveMethod,
      employeeId,
    });

    const leaveBalance = await leaveBalanceSchema.findOne({
      employeeId: employeeId,
    });
    if(!leaveBalance) {
      const newLeaveBalance = new leaveBalanceSchema({employeeId : employeeId})
     await newLeaveBalance.save();
    }

    const employee = await employeeSchema.findOne({ employeeID: employeeId });
    const employeeTeam = await teamSchema.findOne({ _id: employee.teamID });
    const teamLeader = await employeeSchema.findOne({
      employeeID: employeeTeam.teamLeadID,
    });

    const condition = {
      teamLeaderBoolean : false,
      task : "request"
    } 

    const sentMail = await sendEmails(employee, newLeave, teamLeader, condition);

    if(!sentMail) {
     return res.status(404).json({
        message: "mail has not send"
      });
    }
    await newLeave.save();
    res.status(200).json({
      message: "Your leave request is successfully completed",
      sentMail: sentMail,
    });

  } catch (error) {
    res.status(400).json({
      message: "Leave Request is not completed",
      error: error.message,
    });
  }
};

module.exports.getLeaveList = async (req, res) => {
  const { id } = req.params;
  try {
    const leaveHistory = await LeaveSchema.find({ employeeId: id });

    if (!leaveHistory) {
      return res.status(404).json({
        success: false,
        description: "Not leave history found",
      });
    }
    res.status(201).json({
      success: true,
      description: "Leaves are fetched successfully",
      leaveHistory: leaveHistory,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "Leaves are failed to fetched",
      error: error.message,
    });
  }
};

module.exports.cancelLeave = async (req, res) => {
  const { id } = req.params;
  const { reason, employeeId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("ID invalid : " + id);

    const employee = await employeeSchema.findOne({ employeeID: employeeId });
    const employeeTeam = await teamSchema.findOne({ _id: employee.teamID });
    const teamLeader = await employeeSchema.findOne({
      employeeID: employeeTeam.teamLeadID,
    });
    const leave = await LeaveSchema.findById(id);

    const condition = {
      teamLeaderBoolean : false,
      task : "cancel"
    } 
    const data = {
      reason : reason,
      leaveType : leave.leaveType
    }
    const sentMail = await sendEmails(employee, data, teamLeader, condition);

    if(sentMail) {
        await LeaveSchema.findByIdAndDelete({ _id : id });
        res.status(201).json({
          success: true,
          description: "Leave is deleted successfully",
        });
    }

  } catch (error) {
    res.status(404).json({
      success: false,
      description: "Leave is failed to delete",
      error: error.message,
    });
  }
};