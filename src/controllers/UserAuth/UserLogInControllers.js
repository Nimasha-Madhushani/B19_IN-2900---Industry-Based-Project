const sensitiveDetailsSchema = require("../../models/ReportersManagementModule/SensitiveDetailsModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const bcrypt = require("bcrypt");
const {
  createAccessToken,
  createRefreshToken,
  refreshTokens,
} = require("./JWTCreator");

//-------Login Employee--------------------
exports.loginEmployee = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const oldUser = await sensitiveDetailsSchema.findOne({ userName });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userProfile = await employeeSchema.findOne({
      employeeID: oldUser.employeeID,
    });
    const accessToken = createAccessToken(
      userProfile.employeeID,
      userProfile.jobRole
    );
    const refreshToken = createRefreshToken(
      userProfile.employeeID,
      userProfile.jobRole
    );
    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      
    });
    res.status(200).json({
      message: "User has successfully sign in!",
      user: userProfile,
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-------LogOut Employee--------------------
exports.logOutEmployee = async (req, res) => {};
