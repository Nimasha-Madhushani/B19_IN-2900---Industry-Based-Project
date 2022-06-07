const jwt = require("jsonwebtoken");

const createAccessToken = (employeeID, jobRole) => {
  return jwt.sign(
    { id: employeeID, jobRole: jobRole },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "20s",
    }
  );
};

const createRefreshToken = (employeeID, jobRole) => {
  return jwt.sign(
    { id: employeeID, jobRole: jobRole },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "365d",
    }
  );
};

module.exports = { createAccessToken, createRefreshToken };
