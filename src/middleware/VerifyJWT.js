const verify = async (res, req, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "You are not authenticated..Please log In" });
    }
    await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY,
      async (error, decodeData) => {
        if (error) {
          return res.status(403).json({
            message: "access token is not valid",
            error: error.message,
          });
        }
        if (req.params.id == decodeData.id) {
          next();
        }
        return res
          .status(403)
          .json({ message: "You are not authorized for this.." });
      }
    );
  } catch (error) {
    return res
      .status(403)
      .json({ message: "You are not authorized", error: error.message });
  }
};
