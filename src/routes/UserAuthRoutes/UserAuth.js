const express = require('express');
const { refreshToken } = require('../../controllers/UserAuth/RefreshController');
const { loginEmployee, logOutEmployee, countofEmployees } = require('../../controllers/UserAuth/UserLogInControllers');
const verify = require('../../middleware/VerifyJWT');
const router = express.Router();

router.post("/login", loginEmployee);
router.post("/logout/:id", logOutEmployee);

router.post("/refresh", refreshToken);
router.get("/countEmployees", countofEmployees);
module.exports = router;