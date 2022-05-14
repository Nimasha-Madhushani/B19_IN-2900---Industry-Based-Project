const express = require("express");
const userRoles = require("../../Config/UserRoles");
const {
  createCandidate,
  findCandidate,
  updateCandidate,
  getAllCandidates,
} = require("../../controllers/recruitmentSection/candidateControllers");
const {
  createInterview,
  cancelInterview,
  updateInterview,
  getInterviews,
  markedCandidate,
} = require("../../controllers/recruitmentSection/InterviewControllers");
const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");
const router = express.Router();

// routes for the candidates
router.post("/candidate/create", createCandidate);
router.get("/candidate/:NIC", findCandidate);
router.put("/candidate/:id", updateCandidate);
router.get("/candidates", getAllCandidates); // need to make this right(It should change to fetch last two months updated candidate)

// routes for the interviews
router.post("/interview/create", createInterview);
router.delete("/interview/:id", cancelInterview);
router.put("/interview/:id", updateInterview);
router.get("/interview/:id", getInterviews);
router.put("/interview/start/:id", markedCandidate);

module.exports = router;
