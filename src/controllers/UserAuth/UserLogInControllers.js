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
      teamID
    } = userProfile;

    res.status(200).json({
      message: "User has successfully sign in!",
      user: {
        _id,
        employeeID,
        employeeFirstName,
        employeeLastName,
        jobRole,
        profilePic,
        teamID: teamID ? teamID: null,
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

//-----controller for creating first user to the database as HR manager
exports.createFirstEmployee = async (req, res) => {
  const {
    employeeID,
    employeeFirstName,
    employeeLastName,
    jobRole,
    NIC,
    companyEmail,
    candidateID,
  } = req.body;

  try {
    const username = employeeFirstName.toUpperCase() + "." + employeeID;
    const password = NIC.toUpperCase();

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);

    const existingSensitiveDetails = await sensitiveDetailsSchema.findOne({
      employeeID,
    });
    const existingEmpID = await employeeSchema.findOne({ employeeID });

    if (!existingEmpID && !existingSensitiveDetails) {
      const newEmployee = new employeeSchema({
        employeeID,
        employeeFirstName,
        employeeLastName,
        jobRole,
        NIC,
        companyEmail,
        candidateID: candidateID,
      });

      const sensitiveDetails = new sensitiveDetailsSchema({
        userName: username,
        password: encryptedPassword,
        employeeID,
      });
      const savedEmployee = await newEmployee.save();

      const savedSensitiveDetail = await sensitiveDetails.save();
      //-------------

      //-------------
      if (savedEmployee && savedSensitiveDetail) {
        
        const accessToken = createAccessToken(
          employeeID,
          jobRole
        );
        const refreshToken = createRefreshToken(
          employeeID,
          jobRole
        );
    
        await employeeSchema.updateOne(
          { employeeID: employeeID },
          { $set: { token: refreshToken } }
        );
    
    
        res.status(200).json({
          message: "User has successfully sign up!",
          user: {
            employeeID,
            employeeFirstName,
            employeeLastName,
            jobRole,
          },
          accessToken: accessToken,
          refreshToken: refreshToken,
          success: true,
        });

      }
    } else {
      res.status(400).json({
        message: "Employee or sensitive details is Duplicated!",
        success: false,
      });
      
    }
  } catch (err) {
    res.status(400).json({
      message: "Employee and Sensitive Details are not Added!",
      error: err.message,
    });
  }
};