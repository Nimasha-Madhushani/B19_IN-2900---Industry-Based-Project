const AnsweredQuestionPaper = require("../../models/PromotionModule/AnsweredQuestionPaper");
const Promotions = require("../../models/PromotionModule/Promotions");
const EmployeeModel = require("../../models/ReportersManagementModule/EmployeeModel");

exports.getEvaluationDetails = async (req, res) => {
  try {
    const evaluationDetails = await AnsweredQuestionPaper.find({
      TeamLeadID: { $ne: undefined },
      isPromoted: false,
    });
    if (!evaluationDetails) {
      return res.status(200).json({
        success: false,
        message: "Data has not fetch successfully",
      });
    }
    let evaluations = [];
    await Promise.all(
      evaluationDetails.map(async (evaluation) => {
        const employee = await EmployeeModel.findOne({
          employeeID: evaluation.EmployeeID,
        });

        const teamLead = await EmployeeModel.findOne({
          employeeID: evaluation.TeamLeadID,
        });
        if (employee && teamLead) {
          evaluations.push({
            employeeID: employee.employeeID,
            employeeName:
              employee.employeeFirstName + " " + employee.employeeLastName,
            employeePic: employee.profilePic,
            jobRole: employee.jobRole,
            teamLeadName:
              teamLead.employeeFirstName + " " + teamLead.employeeLastName,
            teamLeadPic: teamLead.profilePic,
            teamLeadID: teamLead.employeeID,
            evaluation,
          });
        }
      })
    );

    res.status(200).json({
      success: true,
      evaluationDetails: evaluations.length == 0 ? null : evaluations,
      message: "Data has  fetch successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Data has not fetch successfully",
    });
  }
};

exports.promoteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, newPosition, previousPosition, evaluator } = req.body;
    const promotedDate = new Date();

    const newPromotion = new Promotions({
      employeeID: id,
      evaluatorID: evaluator,
      promotedDate,
      newPosition,
      previousPosition,
    });

    await newPromotion.save();

    await EmployeeModel.findOneAndUpdate(
      { employeeID: id },
      { $set: { jobRole: newPosition } }
    );
    await AnsweredQuestionPaper.findByIdAndUpdate(
      { _id: _id },
      { $set: { isPromoted: true } }
    );
    res.status(200).json({
      success: true,
      message: "Employee is promoted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Employee is not promoted",
    });
  }
};

exports.getPromotionHistory = async (req, res) => {
  try {
    const promotionHistory = await Promotions.find();
    if (!promotionHistory) {
      return res.status(400).json({
        success: false,
        message: "can not fetch promotion history",
      });
    }

    let History = [];
    await Promise.all(
      promotionHistory.map(async (history) => {
        const employee = await EmployeeModel.findOne({
          employeeID: history.employeeID,
        });

        const evaluator = await EmployeeModel.findOne({
          employeeID: history.evaluatorID,
        });

        History.push({
          _id: history._id,
          employeeID: employee.employeeID,
          employeeName:
            employee.employeeFirstName + " " + employee.employeeLastName,
          employeePic: employee.profilePic,
          jobRole: employee.jobRole,
          teamLeadName:
            evaluator.employeeFirstName + " " + evaluator.employeeLastName,
          teamLeadPic: evaluator.profilePic,
          teamLeadID: evaluator.employeeID,
          promotedDate: history.promotedDate,
          newPosition: history.newPosition,
          previousPosition: history.previousPosition,
        });
      })
    );

    res.status(200).json({
      success: true,
      promotionHistory: History,
      message: "fetched promotion history successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: "can not fetch promotion history",
    });
  }
};
