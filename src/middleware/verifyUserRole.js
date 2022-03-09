const teamSchema = require("../models/ReportersManagementModule/TeamModel");
const jwt = require("jsonwebtoken");

const verifyRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      let accessToken = req.headers.authorization;
      let authorized = false;
      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "You are not authenticated..Please log In" });
      }

      accessToken = accessToken.split(" ")[1];
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
          switch (decodeData.jobRole) {
            case "HR":
            case "IT":
            case "CTO":
              await Promise.all(
                allowedRoles.map((role) => {
                  if (role == decodeData.jobRole) {
                    authorized = true;
                  }
                })
              );
              break;
            default:
              const isTeamLeader = await teamSchema.findOne({
                teamLeadID: decodeData.id,
              });
              if (isTeamLeader) {
                await Promise.all(
                  allowedRoles.map((role) => {
                    if (role == "TeamLeader") {
                      authorized = true;
                    }
                  })
                );
              }

              break;
          }
          if (authorized) {
            next();
          } else {
            return res.status(403).json({
              message: "You are not authorized for this action.",
            });
          }
        }
      );
    } catch (error) {
      res.status(403).json({
        message: "You are not authorized for this action.",
        error: error.message,
      });
    }
  };
};

module.exports = verifyRoles;
