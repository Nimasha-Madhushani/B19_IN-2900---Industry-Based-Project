const router = require("express").Router();


//request leave
router.post("/request",leaveRequest);

//view leavetable by team leader
router.get("/list",leaveList);

//view leave history employee vise
router.get("/history/:id",leaveHistory);

//reject or approve leave
router.patch("/list/action/:id",rejectOrApprove);

//cancel leave request
router.get("/history/:id",leaveHistory);
