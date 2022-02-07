const mongoose = require("mongoose");
const InterviewSchema = require("../../models/RecruitmentModule/InterviewModel");

module.exports.createInterview = async (req, res) => {
  const {
    candidateID,
    InterviewType,
    InterviewDate,
    InterviewTime,
    InterviewerID,
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(candidateID))
      return res.status(400).send("ID invalid : " + candidateID);

    const hour = InterviewTime.slice(0, 2);
    const minute = InterviewTime.slice(3);
    const year = new Date(InterviewDate).getFullYear();
    const month = new Date(InterviewDate).getMonth();
    const day = new Date(InterviewDate).getDate();

    const InterviewDateAndTime = new Date(year, month, day, hour, minute);

    const interview = new InterviewSchema({
      candidateID,
      InterviewType,
      InterviewDate: InterviewDateAndTime,
      InterviewerID,
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
    const interview = await InterviewSchema.findOne({ _id: id });

    if (interview) {
      if (new Date() < interview.InterviewDate) {
        const deletedInterview = await InterviewSchema.findByIdAndDelete(id);
        res.status(201).json({
          success: true,
          description: "Interview canceled",
          deletedInterview: deletedInterview,
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
        const { candidateID, InterviewType, InterviewDate, InterviewerID } =
          req.body;
        const interview = {
          _id: req.params.id,
          candidateID,
          InterviewType,
          InterviewDate,
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
          description: "interview updated",
        });
      } else {
        const { CandidateMarks } = req.body;

        await InterviewSchema.updateOne(
          { _id: req.params.id },
          { $push: { CandidateMarks: CandidateMarks } }
        );

        res.status(201).json({
          success: true,
          description: "candidate marks updated in interview",
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
            date.getHours() - 6,
          ),
        ],
      },
      InterviewerID: {
        $elemMatch: { 
          id: id
        },
      },
    });
    
    res.status(201).json({
      success: true,
      description: "interviews are fetched successfully",
      Interviews: interviews,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "interviews are failed to fetched",
      error: error.message,
    });
  }
};
