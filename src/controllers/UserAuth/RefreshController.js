const { createAccessToken, createRefreshToken } = require("./JWTCreator");
const jwt = require("jsonwebtoken");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");

exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.token;

  try {
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "You are not authenticated!..Please log In" });
    }
    if (!(await employeeSchema.findOne({ token: refreshToken }))) {
      return res.status(403).json({ message: "Refresh token is not valid!" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (error, decodeData) => {
        if (error)
          return res.status(403).json({
            message: "Refresh token is not valid!",
            error: err.message,
          });

        const newAccessToken = createAccessToken(
          decodeData.id,
          decodeData.jobRole
        );
        const newRefreshToken = createRefreshToken(
          decodeData.id,
          decodeData.jobRole
        );

        await employeeSchema.updateOne(
          { employeeID: decodeData.id},
          { $set: { token: newRefreshToken } }
        );

        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          update: update,
        });
      }
    );
  } catch (error) {
    res.status(403).json({
      message: "new access and refresh token have not created",
      error: error.message,
    });
  }
};
