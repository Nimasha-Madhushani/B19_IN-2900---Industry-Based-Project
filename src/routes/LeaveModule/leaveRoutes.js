const express = require("express");
const {
  getLeaveList,
  requestLeave,
  cancelLeave,
} = require("../../controllers/LeaveSection/leaveEmaployeeControllers");
const {
  getRequestedLeave,
  responseRequestedLeave,
} = require("../../controllers/LeaveSection/leaveTeamLeaderControllers");

const router = express.Router();

router.get("/:id", getLeaveList);
router.post("/request", requestLeave);
router.delete("/cancel/:id", cancelLeave);


router.get("/requestedLeave/:id", getRequestedLeave);
router.post("/requestedLeave/response/:id", responseRequestedLeave);

module.exports = router;
