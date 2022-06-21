const express = require("express");
const { getEmployees } = require("../../controllers/LeaveSection/emloyees");
const {
  getLeaveList,
  requestLeave,
  cancelLeave,
  getLeaveBalance,
  getTeamLead,
  increaseLeaves,
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
router.get("/increaseLeaves/employees", getEmployees);

router.post("/entitledLeaves/increaseLeaves/:id", increaseLeaves); 



module.exports = router;
 