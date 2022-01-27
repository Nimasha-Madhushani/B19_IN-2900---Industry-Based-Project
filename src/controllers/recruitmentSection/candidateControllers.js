const mongoose = require("mongoose");
const candidateSchema = require("../../models/recruitmentSection/CandidateModel");

// create a new candidate

module.exports.createCandidate = async (req, res) => {
  const { candidateName, NIC, email, phoneNumber, cv } = req.body;

  try {
    const existsCandidate = await candidateSchema.findOne({ NIC });
    if (existsCandidate) {
      return res
        .status(400)
        .json({ success: false, error: "candidate already exists" });
    }
    const candidate = new candidateSchema({
      candidateName,
      NIC,
      email,
      phoneNumber,
      cv,
    });
    const savedCandidate = await candidate.save();
    res
      .status(200)
      .json({
        success: true,
        description: "candidate created",
        candidateName: savedCandidate.candidateName,
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        description: "candidate is not created",
        error: error.message,
      });
  }
};

// find a candidate

module.exports.findCandidate = async (req, res) => {
  const { NIC } = req.params;
  if (!mongoose.Types.ObjectId.isValid(NIC))
    return res.status(400).send("NIC invalid : " + NIC);

  try {
    const candidate = await candidateSchema.findOne({ NIC });
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "This candidate does not exists" });
    }

    res.status(200).json({
      success: true,
      description: "candidate found",
      candidate: candidate,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "candidate NOT found",
      error: error.message,
    });
  }
};

// update a candidate profile

module.exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("ID invalid : " + id);

  try {
    const { candidateName, NIC, email, phoneNumber, cv } = req.body;
    const candidate = { _id: id, candidateName, NIC, email, phoneNumber, cv };

    const updatedCandidate = await candidateSchema.findByIdAndUpdate(
      id,
      candidate,
      { new: true }
    );
    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ success: false, description: "candidate failed to update" });
    }
    res.status(201).json({
      success: true,
      description: "candidate updated",
      candidateName: updatedCandidate.candidateName,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      description: "candidate failed to update",
      error: error.message,
    });
  }
};
