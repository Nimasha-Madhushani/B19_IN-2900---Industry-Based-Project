const express = require("express");
const {
  createCandidate,
  findCandidate,
  updateCandidate,
} = require("../controllers/recruitmentSection/candidateControllers");
const router = express.Router();

router.post("/candidate/create", createCandidate);
router.get("/candidate/:NIC", findCandidate);
router.put("/candidate/:id", updateCandidate);

module.exports = router;
