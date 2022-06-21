const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const academicQualificaationSchema = require("../../models/ReportersManagementModule/AcademicQualificaationModel");
const ProffesionalQualificationSchema = require("../../models/ReportersManagementModule/ProffesionalQualificationModel");
const {
  findOne,
} = require("../../models/ReportersManagementModule/EmployeeModel");
const sensitiveDetailsSchema = require("../../models/ReportersManagementModule/SensitiveDetailsModel");
const candidateSchema = require("../../models/RecruitmentModule/CandidateModel");
const sendEmails = require("./credentialMailHandler");
//-------View all Employees----------------------------
exports.getallEmployees = async (req, res) => {
  await employeeSchema
    .find()
    .then((employees) => {
      res.status(200).json({ state: true, data: employees });
    })
    .catch((err) => {
      res.status(400).json({ state: false, err: err });
    });
};

//------------filter employees without teams------------------------------
exports.getEmployees = async (req, res) => {
  try {
    let employees = [];
    const filterEmp = await employeeSchema.find();
    await Promise.all(
      filterEmp.map(async (employee) => {
        if (employee.teamID == "" || employee.teamID == undefined) {
          const {
            employeeID,
            employeeFirstName,
            employeeLastName,
            profilePic,
            jobRole
          } = employee;
          employees.push({
            employeeID,
            employeeName: employeeFirstName + " " + employeeLastName,
            profilePic,
            jobRole
          });
        }
      })
    );

    res.status(200).json({ state: true, data: employees });
  } catch (err) {
    res.status(400).json({ state: false, err: err });
  }
};

//-------View Employees with acc & prof Qualification----------------------------

exports.viewEmployees = async (req, res) => {
  try {
    const collectionOne = await employeeSchema.aggregate([
      {
        $lookup: {
          from: "academicqualifications",
          localField: "employeeID", // field in the orders collection
          foreignField: "employeeID", // field in the items collection
          as: "EmployeeWithAcc",
        },
      },

      {
        $lookup: {
          from: "proffesionalqualifications",
          localField: "employeeID",
          foreignField: "employeeID",
          as: "EmpWithProf",
        },
      },
    ]);
    let employeesInfo = [];
    collectionOne.map((userInfo) => {
      const { EmployeeWithAcc, EmpWithProf, ...other } = userInfo;

      employeesInfo.push({
        user: other,
        EmpWithProf: EmpWithProf ? EmpWithProf[0] : {},
        EmployeeWithAcc: EmployeeWithAcc ? EmployeeWithAcc[0] : {},
      });
    });

    res.status(200).json({ data: employeesInfo });
  } catch (err) {
    return res.status(404).json({ err: err.message });
  }
};

//-------Create Employee Profile--------------------

exports.createEmployee = async (req, res) => {
  const {
    employeeID,
    employeeFirstName,
    employeeLastName,
    jobRole,
    NIC,
    companyEmail,
    // status,
    // jobType,
  } = req.body;

  try {
    //create employeeID
    // const ID="DFN"+await employeeSchema.count()+1;
    //cerate username and password
    const username = employeeFirstName + "." + employeeID;
    const password = NIC;

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);

    const existingSensitiveDetails = await sensitiveDetailsSchema.findOne({
      employeeID,
    });
    const candidate = await candidateSchema.findOne({ NIC });
    const existingEmpID = await employeeSchema.findOne({ employeeID });

    if (!candidate) {
      return res.status(400).json("Candidate is not existing");
    }

    if (!existingEmpID && !existingSensitiveDetails) {
      const newEmployee = new employeeSchema({
        employeeID,
        employeeFirstName,
        employeeLastName,
        jobRole,
        NIC,
        companyEmail,
        // status,
        // jobType,
        candidateID: candidate._id,
      });

      const sensitiveDetails = new sensitiveDetailsSchema({
        userName: username,
        password: encryptedPassword,
        employeeID,
      });
      const savedEmployee = await newEmployee.save();

      const savedSensitiveDetail = await sensitiveDetails.save();

      if (savedEmployee && savedSensitiveDetail) {
        res.status(200).json({
          success: true,
          message: "Employee created",
          employeeCredentials: { username, password },
        });

        await candidateSchema.updateOne(
          { _id: candidate._id },
          {
            $set: { status: "Recruited" },
          }
        );
      }
      //-------------
      const sentMail = await sendEmails(savedSensitiveDetail, savedEmployee);

      //-------------
    } else {
      res.status(400).json({
        message: "Employee or sensitive details is Duplicated!",
        success: false,
      });
      if (sentMail.response.status == 400) {
        return res.status(404).json({
          success: false,
          message: "Credentials are not sent.",
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      message: "Employee and Sensitive Details are not Added!",
      error: err.message,
    });
  }
};

//--------Update employee profile includeing academic proffesional----------------
exports.updateEmployeeProfile = async (req, res) => {
  const { id } = req.params;
  const {
    employeeFirstName,
    employeeLastName,
    birthday,
    streetNo,
    city,
    phoneNumber,
    NIC,
    companyEmail,
    profilePic,
    ordinaryLevelResult,
    advancedLevelResults,
    achievements,
    degree,
    language,
    course,
    jobRole,
    status,
    jobType,
  } = req.body;

  const employee = {
    employeeID: id,
    employeeFirstName,
    employeeLastName,
    birthday,
    streetNo,
    city,
    phoneNumber,
    profilePic,
    NIC,
    companyEmail,
    jobRole,
    status,
    jobType,
  };
  try {
    const existingEmployee = await employeeSchema.findOne({ employeeID: id });

    const candidate = await candidateSchema.findOne({
      _id: existingEmployee.candidateID,
    });

    let changeNIC = false;
    if (candidate.NIC != NIC) {
      await candidateSchema.updateOne(
        { _id: existingEmployee.candidateID },
        {
          $set: { NIC: NIC },
        }
      );

      changeNIC = true;
    }

    if (existingEmployee) {
      //--------------academic qualification update-------------------------------------
      const academicQualification = await academicQualificaationSchema.findOne({
        employeeID: id,
      });
      if (!academicQualification) {
        const newAcademicQualification = new academicQualificaationSchema({
          employeeID: id,
          ordinaryLevelResult,
          advancedLevelResults,
          achievements,
        });
        await newAcademicQualification.save();
      } else {
        const newAcademicQualification = {
          employeeID: id,
          ordinaryLevelResult,
          advancedLevelResults,
          achievements,
        };

        await academicQualificaationSchema.findByIdAndUpdate(
          academicQualification._id,
          newAcademicQualification,
          { new: true }
        );
      }

      //-------------proffesional qualification update------------------------------

      const proffesionalQualification =
        await ProffesionalQualificationSchema.findOne({ employeeID: id });
      if (!proffesionalQualification) {
        const proffesional = new ProffesionalQualificationSchema({
          employeeID: id,
          degree,
          language,
          course,
        });
        await proffesional.save();
      } else {
        const proffesional = {
          employeeID: id,
          degree,
          language,
          course,
        };
        await ProffesionalQualificationSchema.findByIdAndUpdate(
          proffesionalQualification._id,
          proffesional,
          { new: true }
        );
      }

      //-----------update employee details-------------------------------

      await employeeSchema.findByIdAndUpdate(existingEmployee._id, employee, {
        new: true,
      });
      res.status(200).json({
        message: changeNIC
          ? "employee profile,academic qulification, proffesional qualification candidate NIC are  updated successfully"
          : "employee profile,academic qulification, proffesional qualification  are  updated successfully",
        success: true,
      });
    } else {
      res
        .status(400)
        .json({ message: "Employee is not existing", success: "false1" });
    }
  } catch (err) {
    res.status(400).json({
      message:
        "employee profile,academic qulification, proffesional qualification are not updated",
      err: err.message,
      success: false,
    });
  }
};

//------------filter employees according to job roles - create organization structure------
exports.getEmployeesForJobRoles = async (req, res) => {
  try {
    let levelOne = [],
      levelTwo = [],
      levelThree = [],
      levelFour = [],
      organizationStructure = [];
    const allEmployees = await employeeSchema.find();
    await Promise.all(
      allEmployees.map(async (employee) => {
        const {
          employeeID,
          employeeFirstName,
          employeeLastName,
          profilePic,
          jobRole,
        } = employee;
        if (employee.jobRole === "CTO") {
          levelOne.push({
            employeeID,
            Name: employeeFirstName + " " + employeeLastName,
            profilePic,
            jobRole,
          });
        }
        if (
          employee.jobRole === "Senior Software Engineer" ||
          employee.jobRole === "Software Architect" ||
          employee.jobRole === "Tech Lead"
        ) {
          levelTwo.push({
            employeeID,
            Name: employeeFirstName + " " + employeeLastName,
            profilePic,
            jobRole,
          });
        }
        if (
          employee.jobRole === "HR Manager" ||
          employee.jobRole === "Software Engineer" ||
          employee.jobRole === "Product Manager" ||
          employee.jobRole === "IT Employee" ||
          employee.jobRole === "UI/UX Designer" ||
          employee.jobRole === "Business Analyst"
        ) {
          levelThree.push({
            employeeID,
            Name: employeeFirstName + " " + employeeLastName,
            profilePic,
            jobRole,
          });
        }
        if (
          employee.jobRole === "Intern" ||
          employee.jobRole === "Associate Software Engineer"
        ) {
          levelFour.push({
            employeeID,
            Name: employeeFirstName + " " + employeeLastName,
            profilePic,
            jobRole,
          });
        }
      })
    );

    res.status(200).json({
      state: true,
      organizationStructure: { levelOne, levelTwo, levelThree, levelFour },
    });
  } catch (err) {
    res.status(400).json({ state: false, err: err.message });
  }
};

//-----------fetch new candidates without employee profile----------
exports.candidatesWithoutProfile = async (req, res) => {
  try {
    let candidateInfo = [];
    const filterCandidates = await candidateSchema.find({
      status: "Selected",
    });
    await Promise.all(
      filterCandidates.map(async (candidates) => {
        const { candidateName, NIC, appliedPosition } = candidates;
        candidateInfo.push({ candidateName, NIC, appliedPosition });
      })
    );

    res.status(200).json({
      state: true,
      candidateData: candidateInfo,
    });
  } catch (err) {
    res.status(400).json({ state: false, err: err.message });
  }
};

//-------fetch logged employee details-----------------
exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await employeeSchema.find({ employeeID: id });
    const EmployeeWithAcc = await academicQualificaationSchema.find({
      employeeID: id,
    });
    const EmpWithProf = await ProffesionalQualificationSchema.find({
      employeeID: id,
    });
    if (!user || !EmployeeWithAcc || !EmpWithProf) {
      return res.status(400).json({
        message: "user and user details does not exists",
      });
    }
    res.status(200).json({
      message: "user fetch successfully",
      userInfo: {
        user,
        EmployeeWithAcc: EmployeeWithAcc[0],
        EmpWithProf: EmpWithProf[0],
      },
    });
  } catch (error) {
    res.status(400).json({ state: false, err: error.message });
  }
};

//count employees

exports.countEmployees = async (req, res) => {
  try {
    let employeeCount = await employeeSchema.count();
employeeCount=employeeCount+1;

    res.status(200).json({ state: true, count: "DF00".concat(employeeCount) });
  } catch (err) {
    res.status(400).json({ state: false, err: err.message });
  }
};
