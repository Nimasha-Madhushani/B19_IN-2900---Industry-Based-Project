const mongoose = require("mongoose");
const InterviewSchema = require("../../models/RecruitmentModule/InterviewModel");
const candidateSchema = require("../../models/RecruitmentModule/CandidateModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");

module.exports.createInterview = async (req, res) => {
  const {
    candidateID,
    InterviewType,
    InterviewDate,
    InterviewTime,
    Interviewers,
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(candidateID))
      return res.status(400).send("ID invalid : " + candidateID);

    const hour = InterviewTime.slice(0, 2);
    const minute = InterviewTime.slice(3, 5);
    const year = new Date(InterviewDate).getFullYear();
    const month = new Date(InterviewDate).getMonth();
    const day = new Date(InterviewDate).getDate();

    const InterviewDateAndTime = new Date(year, month, day, hour, minute);

    let interviewers = [];
    //await Promise.all(
    Interviewers.map((interviewer) =>
      interviewers.push({ id: interviewer.employeeID, status: "Not Completed" })
    );
    //)

    const interview = new InterviewSchema({
      candidateID,
      InterviewType,
      InterviewDate: InterviewDateAndTime,
      Interviewers: interviewers,
    });

    const savedInterview = await interview.save();
    await candidateSchema.updateOne(
      { _id: candidateID },
      { $set: { status: "Scheduled" } }
    );

    res.status(200).json({
      success: true,
      message: "Interview created successfully for " + InterviewDate,
      candidateID: savedInterview.candidateID,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      description: "Interview did not created",
      error: error.message,
    });
  }
};

module.exports.cancelInterview = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("ID invalid : " + id);
  try {
    const interview = await InterviewSchema.findOne({ _id: id });

    if (interview) {
      if (new Date() < interview.InterviewDate) {
        await InterviewSchema.findByIdAndDelete(id);
        res.status(200).json({
          success: true,
          message: "Interview successfully canceled",
        });
      } else {
        res.status(404).json({
          success: false,
          description: "Interview can not cancel now",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        description: "Interview does not exists",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      description: "Interview did not cancel",
      error: error.message,
    });
  }
};
//update interview
module.exports.updateInterview = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send("ID invalid : " + req.params.id);
  }
  try {
    const ExistsInterview = await InterviewSchema.findOne({
      _id: req.params.id,
    });

    if (ExistsInterview) {
      if (new Date() < ExistsInterview.InterviewDate) {
        const {
          candidateID,
          InterviewType,
          InterviewDate,
          InterviewTime,
          InterviewerID,
        } = req.body;

        const hour = InterviewTime.slice(0, 2);
        const minute = InterviewTime.slice(3, 5);
        const year = new Date(InterviewDate).getFullYear();
        const month = new Date(InterviewDate).getMonth();
        const day = new Date(InterviewDate).getDate();

        const InterviewDateAndTime = new Date(year, month, day, hour, minute);

        const interview = {
          _id: req.params.id,
          candidateID,
          InterviewType,
          InterviewDate: InterviewDateAndTime,
          InterviewerID,
        };
        const updatedInterview = await InterviewSchema.findByIdAndUpdate(
          req.params.id,
          interview,
          { new: true }
        );
        if (!updatedInterview) {
          return res.status(404).json({
            success: false,
            description: "interview is failed to update",
          });
        }
        res.status(201).json({
          success: true,
          message: "Interview successfully updated",
        });
      } else {
        res.status(401).json({
          success: false,
          description: "interview can not updated. Interview Date has passed",
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "interview is failed to update",
      error: error.message,
    });
  }
};

module.exports.getInterviews = async (req, res) => {
  const { id } = req.params;
  try {
    const date = new Date();
    const interviews = await InterviewSchema.find({
      InterviewDate: {
        $gte: [
          "$InterviewDate",
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours() - 6
          ),
        ],
      },
      Interviewers: {
        $elemMatch: {
          id: id,
          status: { $ne: "Completed" },
        },
      },
    });
    let interviewList = [];
    await Promise.all(
      interviews.map(async (interview) => {
        const { _id, candidateID, InterviewDate, InterviewType, Interviewers } =
          interview;
        const candidate = await candidateSchema.findOne({ _id: candidateID });
        let interviewers = [];
        await Promise.all(
          Interviewers.map(async (interviewer) => {
            interviewers.push(
              await employeeSchema.findOne({ employeeID: interviewer.id })
            );
          })
        );
        interviewList.push({
          _id,
          candidate: candidate,
          InterviewDate: InterviewDate,
          InterviewTime: new Date(
            "1970-01-01T" +
              new Date(InterviewDate).toTimeString().slice(0, 5) +
              "Z"
          ).toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          }),
          InterviewType,
          Interviewers: interviewers,
        });
      })
    );

    //console.log(interviewList);

    res.status(201).json({
      success: true,
      description: "interviews are fetched successfully",
      Interviews: interviewList,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "interviews are failed to fetched",
      error: error.message,
    });
  }
};

module.exports.markedCandidate = async (req, res) => {
  const { id } = req.params;
  const marks = req.body;

  try {
    const isEmpty = Object.values(marks).every((x) => x !== null && x !== "");

    if (!isEmpty) {
      return res.status(404).json({
        success: false,
        description: "Marks are failed to Update. All field need be filled",
      });
    }

    const updatedInterview = await InterviewSchema.updateOne(
      { _id: id },
      { $push: { CandidateMarks: marks } },
      { new: true }
    );
    await InterviewSchema.updateOne(
      { _id: id, "Interviewers.id": marks.interviewer },
      { $set: { "Interviewers.$.status": "Completed" } }
    );
    const interview = await InterviewSchema.findOne({ _id: id });


    await candidateSchema.updateOne(
      { _id: interview.candidateID },
      { $set: { status: marks.recommendation } }
    );

    if (!updatedInterview) {
      return res.status(404).json({
        success: false,
        description: "Marks are failed to Update",
      });
    }
    res.status(200).json({
      success: true,
      message: "Marks are successfully Updated",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "Marks are failed to Update",
      error: error.message,
    });
  }
};

module.exports.getInterviewStats = async (req, res) => {
  const { id } = req.params;
  try {
    const CompletedInterviews = await InterviewSchema.find({
      Interviewers: {
        $elemMatch: {
          id: id,
          status: "Completed",
        },
      },
    });

    const RemainingInterviews = await InterviewSchema.find({
      Interviewers: {
        $elemMatch: {
          id: id,
          status: "Not Completed",
        },
      },
    });
    const NonInterviewedCandidate = await candidateSchema.find({
      status: { $in: ["Initiated", "Scheduled"] },
    });

    res.status(200).json({
      success: true,
      InterviewStats: {
        completedInterviews: CompletedInterviews.length,
        remainingInterviews: RemainingInterviews.length,
        candidates: NonInterviewedCandidate.length,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "failed to fetch data",
      error: error.message,
    });
  }
};

module.exports.getInterviewResult = async (req, res) => {
  const interview = req.body;
  try {
    const Interview = await InterviewSchema.findOne({
      candidateID: interview.candidateID,
      InterviewType: interview.interviewType,
    });
    if(Interview) {
      const {
        candidateID,
        InterviewType,
        InterviewDate,
        Interviewers,
        CandidateMarks,
      } = Interview;
      let interviewers = [];
      await Promise.all(
        Interviewers.map(async (interviewer) => {
          const Interviewer = await employeeSchema.findOne({
            employeeID: interviewer.id,
          });
          interviewers.push({ Interviewer, status: interviewer.status });
        })
      );
      let marks = [];
      await Promise.all(
        CandidateMarks.map(async (mark) => {
          const Interviewer = await employeeSchema.findOne({
            employeeID: mark.interviewer,
          });
          marks.push({ Interviewer, marks: mark });
        })
      );
    
      return res.status(200).json({
        success: true,
        InterviewResult:{
          candidateID,
          InterviewType,
          InterviewDate,
          Interviewers: interviewers,
          CandidateMarks: marks,
        },
      });
    }
    res.status(200).json({
      success: true,
      InterviewResult: null
    });
  
    
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "failed to fetch data",
      error: error.message,
    });
  }
};
