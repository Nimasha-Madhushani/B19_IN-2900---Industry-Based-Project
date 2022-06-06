const express = require("express");
const userRoles = require("../../Config/UserRoles");
const {
  createCandidate,
  findCandidate,
  updateCandidate,
  getAllCandidates,
  getRecentCandidates,
} = require("../../controllers/recruitmentSection/candidateControllers");
const {
  createInterview,
  cancelInterview,
  updateInterview,
  getInterviews,
  markedCandidate,
  getInterviewStats,
} = require("../../controllers/recruitmentSection/InterviewControllers");
const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");
const router = express.Router();

// routes for the candidates
router.post("/candidate/create", createCandidate);
router.get("/candidate/:NIC", findCandidate);
router.put("/candidate/:id", updateCandidate);
router.get("/candidates", getAllCandidates); // need to make this right(It should change to fetch last two months updated candidate)
router.get("/candidates/recent", getRecentCandidates); 
// routes for the interviews
router.post("/interview/create", createInterview);
router.delete("/interview/:id", cancelInterview);
router.put("/interview/:id", updateInterview);
router.get("/interview/:id", getInterviews);
router.put("/interview/start/:id", markedCandidate);
router.get("/interview/InterviewStats/:id", getInterviewStats);


module.exports = router;
