const teamSchema = require("../models/ReportersManagementModule/TeamModel");
const jwt = require("jsonwebtoken");

const verifyRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      let accessToken = req.headers.authorization;
      let authorized = false;
      accessToken = accessToken.split(" ")[1];
      if (accessToken === "null") {
        return res
          .status(401)
          .json({success: false,  message: "Unauthenticated" });
      }

      await jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        async (error, decodeData) => {
          if (error) {
            return res.status(403).json({
              success: false,
              message: "access token is not valid",
              error: error.message,
            });
          }
          switch (decodeData.jobRole) {
            case "HR Manager":
            case "IT Employee":
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
              success: false,
              message: "Unauthorized",
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
