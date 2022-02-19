const teamSchema = require("../models/ReportersManagementModule/TeamModel");

const verifyRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization.split(" ")[1];
      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "You are not authenticated..Please log In" });
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
          switch (decodeData.jobRole) {
            case "HR":
            case "IT":
            case "CTO":
              await Promise.all(
                allowedRoles.map((role) => {
                  if (role == decodeData.jobRole) {
                    next();
                  }
                })
              )
              break;
            default:
              const isTeamLeader = await teamSchema.findOne({teamLeadID : decodeData.id});
              if (isTeamLeader) {
                await Promise.all(
                  allowedRoles.map((role) => {
                    if (role == "TeamLeader ") {
                      next();
                    }
                  })
                )
              }

              break;
          }

          return res.status(403).json({
            message: "You are not authorized for this action.",
          });
        }
      );
    } catch (error) {}
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(403);
    next();
  };
};

module.exports = verifyRoles;
