const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const leaveSchema = require("../../models/LeaveManagementModule/LeaveModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const leaveBalanceSchema = require("../../models/LeaveManagementModule/LeaveBalanceModel");
const sendEmails = require("./mailHandler");

module.exports.getRequestedLeave = async (req, res) => {
  const { id } = req.params;
  try {
    const requestedLeave = [];
    const employeeTeam = await teamSchema.findOne({ teamLeadID: id });
    const employee = await employeeSchema.find({
      teamID: employeeTeam._id,
      employeeID: { $ne: id },
    });

    for (let index = 0; index < employee.length; index++) {
      const leave = await leaveSchema.find({
        employeeId: employee[index].employeeID,
      }).sort({_id:-1});

      for (let index2 = 0; index2 < leave.length; index2++) {
        requestedLeave.push({
          employee: employee[index],
          leave: leave[index2],
        });
      }
    }

    if (requestedLeave) {
      return res.status(200).json({
        message: "requested leaves are successfully fetched",
        requestedLeave:requestedLeave,
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
    const team = await teamSchema.findOne({ _id: employee.teamID });

    const teamLeader = await employeeSchema.findOne({
      employeeID: team.teamLeadID,
    });
    const condition = {
      teamLeaderBoolean: true,
      task: reason ? "Rejected" : "Approved",
    };
    const data = {
      reason: reason,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
    };

    if (reason) {
      const result = await sendEmails(employee, data, teamLeader, condition);
      if (result.response.status == 400) {
        return res.status(404).json({
          success: false,
          message: "Cannot reject. Email has not been sent.",
        });
      }
      await leaveSchema.findByIdAndUpdate(id, {
        $set: { status: "Rejected" },
      });
    } else {
      const result = await sendEmails(employee, data, teamLeader, condition);
      if (result.response.status == 400) {
        return res.status(404).json({
          success: false,
          message: "Cannot approve. Email has not been sent.",
        });
      }

      await leaveSchema.findByIdAndUpdate(id, {
        $set: { status: "Approved" },
      });

      const leaveBalance = await leaveBalanceSchema.findOne({
        employeeId: leave.employeeId,
      });

      let numberOfLeaveDates = 0;
      let holidays = 0;
      let newLeaveBalance = 0;

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

      if (leave.leaveMethod == "half Day") {
        numberOfLeaveDates = 0.5;
      } else {
        numberOfLeaveDates -= holidays;
      }

      switch (leave.leaveType) {
        case "Casual":
          newLeaveBalance =
            leaveBalance.approvedCasualLeave + numberOfLeaveDates;
          await leaveBalanceSchema.findOneAndUpdate(
            { employeeId: leave.employeeId },
            { $set: { approvedCasualLeave: newLeaveBalance } }
          );
          break;
        case "Annual":
          newLeaveBalance =
            leaveBalance.approvedAnnualLeave + numberOfLeaveDates;
          await leaveBalanceSchema.findOneAndUpdate(
            { employeeId: leave.employeeId },
            { $set: { approvedAnnualLeave: newLeaveBalance } }
          );
          break;
        case "Medical":
          newLeaveBalance =
            leaveBalance.approvedMedicalLeave + numberOfLeaveDates;
          await leaveBalanceSchema.findOneAndUpdate(
            { employeeId: leave.employeeId },
            { $set: { approvedMedicalLeave: newLeaveBalance } }
          );
          break;
      }
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
