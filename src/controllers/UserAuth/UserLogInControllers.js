const sensitiveDetailsSchema = require("../../models/ReportersManagementModule/SensitiveDetailsModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("./JWTCreator");
const TeamModel = require("../../models/ReportersManagementModule/TeamModel");

//-------Login Employee--------------------
exports.loginEmployee = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const oldUser = await sensitiveDetailsSchema.findOne({ userName });

    if (!oldUser)
      return res
        .status(200)
        .json({ message: "User doesn't exist", success: false });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res
        .status(200)
        .json({ message: "Invalid credentials", success: false });
    }
    const userProfile = await employeeSchema.findOne({
      employeeID: oldUser.employeeID,
    });
    const isTeamLead = await TeamModel.findOne({
      teamLeadID: oldUser.employeeID,
    });
    const accessToken = createAccessToken(
      userProfile.employeeID,
      userProfile.jobRole
    );
    const refreshToken = createRefreshToken(
      userProfile.employeeID,
      userProfile.jobRole
    );

    await employeeSchema.updateOne(
      { employeeID: userProfile.employeeID },
      { $set: { token: refreshToken } }
    );

    const {
      _id,
      employeeID,
      employeeFirstName,
      employeeLastName,
      jobRole,
      profilePic,
    } = userProfile;

    // res.cookie("refreshToken", refreshToken);

    //   res.setHeader('Set-Cookie', cookie.serialize("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     sameSite: 'strict',
    //     maxAge: 60 * 60 * 24 * 7,
    //     path: '/'
    // }))

    res.status(200).json({
      message: "User has successfully sign in!",
      user: {
        _id,
        employeeID,
        employeeFirstName,
        employeeLastName,
        jobRole,
        profilePic,
        teamLead: isTeamLead? true: false
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-------LogOut Employee--------------------
exports.logOutEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await employeeSchema.updateOne(
      { employeeID: id },
      { $set: { token: "", lastSeen: new Date() } }
    );
    res.status(201).json({ message: "Successfully log out..!", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


//-------controller for find number of employees which have accounts in this system
exports.countofEmployees = async (req, res) => {
  try{
   const count = await employeeSchema.countDocuments();
   res.status(201).json({ message: "Successfully counted!",counts:count , success: true });
  }catch(error) {
    res.status(500).json({ message: error.message, success: false });
  }
}