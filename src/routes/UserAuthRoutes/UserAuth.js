const express = require('express');
const { refreshToken } = require('../../controllers/UserAuth/RefreshController');
const { loginEmployee, logOutEmployee } = require('../../controllers/UserAuth/UserLogInControllers');
const router = express.Router();

router.post("/login", loginEmployee);
router.get("/logout", logOutEmployee);

router.get("/refresh", refreshToken);

module.exports = router;