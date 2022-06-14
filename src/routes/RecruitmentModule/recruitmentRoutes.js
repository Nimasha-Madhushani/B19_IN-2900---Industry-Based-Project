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
  getInterviewResult,
} = require("../../controllers/recruitmentSection/InterviewControllers");
const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");
const router = express.Router();

// routes for the candidates
router.post("/candidate/create", createCandidate);
router.get("/candidate/:NIC", findCandidate);
router.put("/candidate/:id", updateCandidate);
router.get("/candidates", getAllCandidates);
router.get("/candidates/recent", getRecentCandidates);
// routes for the interviews
router.post("/interview/create", createInterview);
router.delete("/interview/:id", cancelInterview);
router.put("/interview/:id", updateInterview);
router.get("/interview/:id", getInterviews);
router.put("/interview/start/:id", markedCandidate);
router.get("/interview/InterviewStats/:id", getInterviewStats);
router.post("/interview/scheduled/result", getInterviewResult);

module.exports = router;

// // routes for the candidates
// router.post("/candidate/create", verifyRoles([userRoles.HR]), createCandidate);
// router.get("/candidate/:NIC", verifyRoles([userRoles.HR]), findCandidate);
// router.put("/candidate/:id", verifyRoles([userRoles.HR]), updateCandidate);
// router.get("/candidates", verifyRoles([userRoles.HR]), getAllCandidates);
// router.get(
//   "/candidates/recent",
//   verifyRoles([userRoles.CTO, userRoles.HR, userRoles.TeamLeader]),
//   getRecentCandidates
// );
// // routes for the interviews
// router.post("/interview/create", verifyRoles([userRoles.HR]), createInterview);
// router.delete(
//   "/interview/:id",
//   verifyRoles([userRoles.CTO, userRoles.HR, userRoles.TeamLeader]),
//   cancelInterview
// );
// router.put(
//   "/interview/:id",
//   verifyRoles([userRoles.CTO, userRoles.HR, userRoles.TeamLeader]),
//   updateInterview
// );
// router.get(
//   "/interview/:id",
//   verify,
//   verifyRoles([userRoles.CTO, userRoles.HR, userRoles.TeamLeader]),
//   getInterviews
// );
// router.put(
//   "/interview/start/:id", // should add employeeID for params
//   verifyRoles([userRoles.CTO, userRoles.HR, userRoles.TeamLeader]),
//   markedCandidate
// );
// router.get(
//   "/interview/InterviewStats/:id",
//   verify,
//   verifyRoles([userRoles.CTO, userRoles.HR, userRoles.TeamLeader]),
//   getInterviewStats
// );

// module.exports = router;
