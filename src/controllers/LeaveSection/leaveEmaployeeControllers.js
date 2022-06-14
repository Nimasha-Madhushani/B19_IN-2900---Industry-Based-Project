const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const LeaveSchema = require("../../models/LeaveManagementModule/LeaveModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const leaveBalanceSchema = require("../../models/LeaveManagementModule/LeaveBalanceModel");
const sendEmails = require("./mailHandler");
const { response } = require("express");

module.exports.requestLeave = async (req, res) => {
  const { leaveType, reason, startDate, endDate, leaveMethod, employeeId } =
    req.body;
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
    if (!leaveBalance) {
      const newLeaveBalance = new leaveBalanceSchema({
        employeeId: employeeId,
      });
      await newLeaveBalance.save();
    }

    const employee = await employeeSchema.findOne({ employeeID: employeeId });
    const employeeTeam = await teamSchema.findOne({ _id: employee.teamID });
    const teamLeader = await employeeSchema.findOne({
      employeeID: employeeTeam.teamLeadID,
    });

    const condition = {
      teamLeaderBoolean: false,
      task: "request",
    };

    const sentMail = await sendEmails(
      employee,
      newLeave,
      teamLeader,
      condition
    );
    console.log(sentMail);

    if (sentMail.response.status == 400) {
      return res.status(404).json({
        success: false,
        message:
          "Your leave request is not completed. Email has not been sent.",
      });
    } else {
      await newLeave.save();
      res.status(200).json({
        success: true,
        message: "Your leave request is successfully completed",
        sentMail: sentMail,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: " Your leave Request is not completed",
      error: error.message,
    });
  }
};

module.exports.getLeaveList = async (req, res) => {
  const { id } = req.params;
  try {
    const leaveHistory = await LeaveSchema.find({ employeeId: id });

    let leaveHistoryArray = [];
    leaveHistory.forEach((leave) => {
      let numberOfLeaveDates = 0;
      let holidays = 0;

      for (
        let index = new Date(leave.startDate);
        index <= new Date(leave.endDate);
        index.setDate(index.getDate() + 1)
      ) {
        if (index.getDay() == 0 || index.getDay() == 6) {
          holidays++;
        }

        numberOfLeaveDates++;
      }

      numberOfLeaveDates -= holidays;
      const singleLeave = {
        leaveHistory: leave,
        numberOfLeaveDates:
          leave.leaveMethod == "half Day" ? 0.5 : numberOfLeaveDates,
      };
      leaveHistoryArray.push(singleLeave);
    });

    if (!leaveHistory) {
      return res.status(404).json({
        success: false,
        description: "Not leave history found",
      });
    }
    res.status(201).json({
      success: true,
      description: "Leaves are fetched successfully",
      leaveHistory: leaveHistoryArray,
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
      teamLeaderBoolean: false,
      task: "cancel",
    };
    const data = {
      reason: reason,
      leaveType: leave.leaveType,
      leaveStartDate: leave.startDate,
      leaveEndDate: leave.endDate,
      prevReason: leave.reason,
    };
    const sentMail = await sendEmails(employee, data, teamLeader, condition);

    if (sentMail) {
      await LeaveSchema.findByIdAndDelete({ _id: id });
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

module.exports.getLeaveBalance = async (req, res) => {
  const id = req.params.id;

  try {
    const leaveBalance = await leaveBalanceSchema.findOne({
      employeeId: id,
    });

    if (!leaveBalance) {
      return res.status(404).json({
        success: false,
        msg: "Leave balance is not found",
      });
    }

    const {
      entitledAnnualLeave,
      entitledCasualLeave,
      entitledMedicalLeave,
      approvedAnnualLeave,
      approvedCasualLeave,
      approvedMedicalLeave,
      employeeId,
    } = leaveBalance;

    const remainingLeaves = {
      remainingAnnual: entitledAnnualLeave - approvedAnnualLeave,
      remainingCasual: entitledCasualLeave - approvedCasualLeave,
      remainingMedical: entitledMedicalLeave - approvedMedicalLeave,
      employeeId: employeeId,
    };

    res.status(200).json({
      success: true,
      remainingLeaves: remainingLeaves,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getTeamLead = async (req, res) => {
  const employeeID = req.params.id;
  try {
    const employee = await employeeSchema.findOne({
      employeeID: employeeID,
    });
    const team = await teamSchema.findOne({ _id: employee.teamID });
    const teamLeader = await employeeSchema.findOne({
      employeeID: team.teamLeadID,
    });
    //const  teamLeader = Object.assign(teamLead,team);
    res.status(200).json({
      success: true,
      teamLeader: teamLeader,
      teamName: team.teamName,
    });
  } catch (error) {
    console.log(error);
  }
};
