const jwt = require("jsonwebtoken");
const EmployeeSchema = require("../models/ReportersManagementModule/EmployeeModel");

const verify = async (req, res, next) => {
  try {
    let accessToken = req.headers.authorization;
    accessToken = accessToken.split(" ")[1];
    if (accessToken === "null") {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (error, decodeData) => {
        if (error) {
          return res.status(403).json({
            message: "access token is not valid",
            error: error.message,
          });
        }
        if (!req.params.id) {
          const isUserLogIn = await EmployeeSchema.findOne({
            employeeID: decodeData.id,
          });
          if (!isUserLogIn.token) {
            return res
              .status(401)
              .json({ message: "You are not authenticated..Please log In" });
          }
          next();
        } else if (req.params.id == decodeData.id) {
          next();
        } else {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
        }
      }
    );
  } catch (error) {
    res
      .status(403)
      .json({ message: "You are not authorized", error: error.message });
  }
};

module.exports = verify;
