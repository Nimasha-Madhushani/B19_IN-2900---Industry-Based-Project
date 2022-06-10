const express = require("express");
const {
  getLeaveList,
  requestLeave,
  cancelLeave,
  getLeaveBalance,
  getTeamLead,
} = require("../../controllers/LeaveSection/leaveEmaployeeControllers");
const {
  getRequestedLeave,
  responseRequestedLeave,
} = require("../../controllers/LeaveSection/leaveTeamLeaderControllers");

const router = express.Router();

router.get("/:id", getLeaveList);
router.post("/request", requestLeave);
router.post("/cancel/:id", cancelLeave); 


router.get("/requestedLeave/:id", getRequestedLeave);
router.post("/requestedLeave/response/:id", responseRequestedLeave);
router.get("/LeaveBalance/:id", getLeaveBalance);
router.get("/request/teamLead/:id", getTeamLead);


module.exports = router;
