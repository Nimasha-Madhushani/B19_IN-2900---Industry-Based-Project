const {
  refreshTokens,
  createAccessToken,
  createRefreshToken,
} = require("./JWTCreator");

exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "You are not authenticated!..Please log In" });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Refresh token is not valid!" });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (error, decodeData) => {
      if (error)
        return res
          .status(403)
          .json({ message: "Refresh token is not valid!", error: err.message });

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = createAccessToken(
        decodeData.ID,
        decodeData.jobRole
      );
      const newRefreshToken = createRefreshToken(
        decodeData.ID,
        decodeData.jobRole
      );

      refreshTokens.push(newRefreshToken);

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};
