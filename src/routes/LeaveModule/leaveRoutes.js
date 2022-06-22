const express = require("express");
const userRoles = require("../../Config/UserRoles");
const { getEmployees } = require("../../controllers/LeaveSection/emloyees");
const {
  getLeaveList,
  requestLeave,
  cancelLeave,
  getLeaveBalance,
  getTeamLead,
  increaseLeaves,
  getLeaveBalanceOfEmployees,
} = require("../../controllers/LeaveSection/leaveEmaployeeControllers");
const {
  getRequestedLeave,
  responseRequestedLeave,
} = require("../../controllers/LeaveSection/leaveTeamLeaderControllers");
const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");

const router = express.Router();

router.get("/:id",verify, getLeaveList);
router.post("/request", requestLeave);
router.post("/cancel/:id", cancelLeave); 


router.get("/requestedLeave/:id",verify,verifyRoles([userRoles.TeamLeader]), getRequestedLeave);
router.post("/requestedLeave/response/:id",verifyRoles([userRoles.TeamLeader]), responseRequestedLeave);
router.get("/LeaveBalance/:id",verify, getLeaveBalance);
router.get("/LeaveBalance/teamMember/remaining",verifyRoles([userRoles.HR]), getLeaveBalanceOfEmployees);
router.get("/request/teamLead/:id",verify, getTeamLead);
router.get("/increaseLeaves/employees", verifyRoles([userRoles.HR]), getEmployees);

router.post("/entitledLeaves/increaseLeaves/:id",verifyRoles([userRoles.HR]), increaseLeaves); 



module.exports = router;
 