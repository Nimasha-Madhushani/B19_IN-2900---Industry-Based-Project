const mongoose = require("mongoose");
const InterviewSchema = require("../../models/RecruitmentModule/InterviewModel");

module.exports.createInterview = async (req, res) => {
  const {
    candidateID,
    InterviewType,
    InterviewDate,
    InterviewTime,
    InterviewerID,
    CandidateMarks,
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(candidateID))
      return res.status(400).send("ID invalid : " + candidateID);
    const interview = new InterviewSchema({
      candidateID,
      InterviewType,
      InterviewDate,
      InterviewTime,
      InterviewerID,
      CandidateMarks,
    });

    const savedInterview = await interview.save();

    res.status(200).json({
      success: true,
      description: "Interview created for " + InterviewDate,
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
    const interview = await InterviewSchema.findOne({ id });
    //console.log(interview);
    if (interview) {
      const hour = interview.InterviewTime.slice(0, 2);
      const minute = interview.InterviewTime.slice(3);
      const year = new Date(interview.InterviewDate).getFullYear();
      const month = new Date(interview.InterviewDate).getMonth();
      const day = new Date(interview.InterviewDate).getDate();

      const today = new Date();
      const interviewDate = new Date(year, month, day, hour, minute);
      
      //console.log(today.toString());
      //console.log(interviewDate.toString());
      if (today.getTime() < interviewDate.getTime()) {
        const deletedInterview = await InterviewSchema.findByIdAndDelete(id);
        res.status(201).json({
            success: true,
            description: "Interview canceled",
            deletedInterview: deletedInterview,
          });
      } else{
        res.status(404).json({
            success: false,
            description: "Interview can not cancel now",
          });
      }
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      description: "Interview did not cancel",
      error: error.message,
    });
  }
};

module.exports.updateInterview = async (req, res) => {};

module.exports.getInterviews = async (req, res) => {};
