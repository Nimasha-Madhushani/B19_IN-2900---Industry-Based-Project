const express = require("express");
const {
  createCandidate,
  findCandidate,
  updateCandidate,
} = require("../../controllers/recruitmentSection/candidateControllers");
const {
  createInterview,
  cancelInterview,
  updateInterview,
  getInterviews,
} = require("../../controllers/recruitmentSection/InterviewControllers");
const router = express.Router();

// routes for the candidates
router.post("/candidate/create", createCandidate);
router.get("/candidate/:NIC", findCandidate);
router.put("/candidate/:id", updateCandidate);

// routes for the interviews
router.post("/interview/create", createInterview);
router.delete("/interview/:id", cancelInterview);
router.put("/interview/:id", updateInterview);
router.get("/interview/:id", getInterviews);

module.exports = router;
