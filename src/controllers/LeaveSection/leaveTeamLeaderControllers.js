const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const leaveSchema = require("../../models/LeaveManagementModule/LeaveModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const leaveBalanceSchema = require("../../models/LeaveManagementModule/LeaveBalanceModel");
const sendEmails = require("./mailHandler");

module.exports.getRequestedLeave = async (req, res) => {
  const { id } = req.params;
  try {
    const employeeTeam = await teamSchema.findOne({ teamLeadID: id });
    const employee = await employeeSchema.findOne({
      teamID: employeeTeam.teamID,
    });
    const requestedLeave = await leaveSchema.findOne({
      employeeID: employee.employeeId,
      status: "Pending",
    });
    if (requestedLeave) {
      return res.status(200).json({
        message: "requested leaves are successfully fetched",
        requestedLeave: requestedLeave,
      });
    }
    return res.status(404).json({
      message: "Not match found",
    });
  } catch (error) {
    return res.status(400).json({
      message: "requested leaves are failed to fetched",
      error: error.message,
    });
  }
};

module.exports.responseRequestedLeave = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("ID invalid : " + id);

    const leave = await leaveSchema.findById(id);
    const employee = await employeeSchema.findOne({
      employeeID: leave.employeeId,
    });
    const team = await teamSchema.findOne({ teamID: employee.teamID });
    const teamLeader = await employeeSchema.findOne({
      employeeID: team.teamLeadID,
    });
    const teamLeaderBoolean = true;

    if (reason) {
      await leaveSchema.findByIdAndUpdate(id, {
        $set: { status: "Rejected" },
      });
      await sendEmails(employee, reason, teamLeader, teamLeaderBoolean);
    } else {
      await leaveSchema.findByIdAndUpdate(id, {
        $set: { status: "approved" },
      });
      await sendEmails(employee, reason, teamLeader, teamLeaderBoolean);
    }

    const leaveBalance = await leaveBalanceSchema.findOne({
      employeeId: leave.employeeId,
    });

    const numberOfLeaveDates = 0;
    const holidays = 0;
    const newLeaveBalance = 0;

    for (
      let index = new Date("2022-02-01");
      index <= new Date("2022-02-10");
      index.setDate(index.getDate() + 1)
    ) {
      if (index.getDay() == 0 || index.getDay() == 6) {
        holidays++;
      }
      numberOfLeaveDates++;
    }

    numberOfLeaveDates -= holidays;

    switch (leave.leaveType) {
      case "casual":
        newLeaveBalance = leaveBalance.approvedCasualLeave + numberOfLeaveDates;
        await leaveBalanceSchema.findOneAndUpdate(
          { employeeId: leave.employeeId },
          { $set: { approvedCasualLeave: newLeaveBalance } }
        );
        break;
      case "annual":
        newLeaveBalance = leaveBalance.approvedAnnualLeave + numberOfLeaveDates;
        await leaveBalanceSchema.findOneAndUpdate(
          { employeeId: leave.employeeId },
          { $set: { approvedAnnualLeave: newLeaveBalance } }
        );
        break;
      case "medical":
        newLeaveBalance =
          leaveBalance.approvedMedicalLeave + numberOfLeaveDates;
        await leaveBalanceSchema.findOneAndUpdate(
          { employeeId: leave.employeeId },
          { $set: { approvedMedicalLeave: newLeaveBalance } }
        );
        break;
    }
    res.status(200).json({
      message:
        "response has managed successfully and leave balance has updated",
    });
  } catch (error) {
    res.status(400).json({
      message: "response has not managed successfully",
      error: error.message,
    });
  }
};
