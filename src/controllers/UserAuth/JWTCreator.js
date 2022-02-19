const jwt = require("jsonwebtoken");
const refreshTokens = [];
const createAccessToken = (employeeID, jobRole) => {
  return jwt.sign(
    { id: employeeID, jobRole: jobRole },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "15min",
    }
  );
};

const createRefreshToken = (employeeID, jobRole) => {
  return jwt.sign(
    { id: employeeID, jobRole: jobRole },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "1y",
    }
  );
};

module.exports = { createAccessToken, createRefreshToken, refreshTokens };
