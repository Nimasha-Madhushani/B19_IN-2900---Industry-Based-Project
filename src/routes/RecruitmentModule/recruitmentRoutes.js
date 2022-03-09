const express = require("express");
const userRoles = require("../../Config/UserRoles");
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
const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");
const router = express.Router();

// routes for the candidates
router.post("/candidate/create", verifyRoles([userRoles.HR]), createCandidate);
router.get("/candidate/:NIC", verifyRoles([userRoles.HR]), findCandidate);
router.put("/candidate/:id", verifyRoles([userRoles.HR]), updateCandidate);

// routes for the interviews
router.post("/interview/create", verifyRoles([userRoles.HR]), createInterview);
router.delete("/interview/:id", verifyRoles([userRoles.HR]), cancelInterview);
router.put("/interview/:id", verifyRoles([userRoles.HR]), updateInterview);
router.get(
  "/interview/:id",
  verify,
  verifyRoles([userRoles.HR, userRoles.CTO, userRoles.TeamLeader]),
  getInterviews
);

module.exports = router;
