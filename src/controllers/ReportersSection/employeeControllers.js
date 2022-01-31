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
const AssetLender = require("../../models/AssetsManagementModule/AssetsLender");

//-------View Employees-----------------------------

exports.viewEmployees = async (req, res) => {
  await employeeSchema
    .find()
    .then((employees) => {
      res.json(employees);
    })
    .catch((err) => {
      console.log(err);
    });
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
    status,
    jobType,
  } = req.body;

  //----------create username & password---------------------------
  const username = employeeFirstName + "." + employeeID;
  const password = NIC;

  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);

  const candidate = await candidateSchema.findOne({ NIC });

  const newEmployee = new employeeSchema({
    employeeID,
    employeeFirstName,
    employeeLastName,
    jobRole,
    NIC,
    companyEmail,
    status,
    //resignDate,
    jobType,
    candidateID: candidate._id,
  });

  const sensitiveDetails = new sensitiveDetailsSchema({
    username,
    password: encryptedPassword,
    employeeID,
  });

  await newEmployee
    .save()
    .then(() => {
      res.json("Employee has successfully added!");
    })
    .catch((err) => {
      res.status(400).json({ message: "Employee is not Added!" });
      console.log(err);
    });

  await sensitiveDetails
    .save()
    .then(() => {
      res.json("Sensitive Details has successfully added!");
    })
    .catch((err) => {
      res.status(400).json({ message: "Sensitive Details are not Added!" });
      console.log(err);
    });
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
    jobRole,
    NIC,
    companyEmail,
    status,
    jobType,
    ordinaryLevelResult,
    advancedLevelResults,
    achievements,
    degree,
    language,
    course,
  } = req.body;

  const employee = {
    employeeID: id,
    employeeFirstName,
    employeeLastName,
    birthday,
    streetNo,
    city,
    phoneNumber,
    jobRole,
    NIC,
    companyEmail,
    status,
    jobType,
    // candidateID : candidate._id,
  };

  const existingEmployee = await employeeSchema.findOne({ employeeID: id });

  if (existingEmployee) {
    let academicFlag = 0,
      proffesionalFlag = 0,
      employeeFlag = 0; //flags

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
      await newAcademicQualification
        .save()
        .then(() => {
          //  res.json("Academic Qualifictions added successfully!");
          academicFlag = 1;
        })
        .catch((err) => {
          res
            .status(400)
            .json({ message: "Academic Qualifictions are not added!" });
        });
    } else {
      const newAcademicQualification = {
        employeeID: id,
        ordinaryLevelResult,
        advancedLevelResults,
        achievements,
      };
      await academicQualificaationSchema
        .findByIdAndUpdate(
          academicQualification._id,
          newAcademicQualification,
          { new: true }
        )
        .then(() => {
          // res.json("Academic Qualifictions updated successfully!");
          academicFlag = 1;
        })
        .catch((err) => {
          res
            .status(400)
            .json({ message: "Academic Qualifictions are not updated !" });
        });
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
      await proffesional
        .save()
        .then(() => {
          // res.json("Proffesional Qualifictions added successfully!");
          proffesionalFlag = 1;
        })
        .catch((err) => {
          res
            .status(400)
            .json({ message: "Proffesional Qualifictions are not added!" });
        });
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
      )
        .then(() => {
          // res.json("Proffesional Qualifictions updated successfully!");
          proffesionalFlag = 1;
        })
        .catch((err) => {
          res
            .status(400)
            .json({ message: "Proffesional Qualifictions are not updated " });
        });
    }

    //-----------update employee details-------------------------------

    await employeeSchema
      .findByIdAndUpdate(existingEmployee._id, employee, { new: true })
      .then(() => {
        //res.json("Employee Updated successfully!");
        employeeFlag = 1;
      })
      .catch((err) => {
        //res.status(400).json({ message: "Employee is not updated!" });
        employeeFlag = 0;
      });

    const academicResponse = academicFlag
      ? "Upadted academic"
      : "not updated academic";
    const proffesionalResponse = proffesionalFlag
      ? "Upadted proffesional"
      : "not updated proffesional";
    const employeeResponse = employeeFlag
      ? "Upadted employee"
      : "not updated employee";

    res.json({ academicResponse, proffesionalResponse, employeeResponse });
  } else {
    res.json("Employee is not existing");
  }
};
//------------------------------------------------------------
//------------------------------------------------------------

//-----------update resign status----------------

exports.updateResignStatus = async (req, res) => {
  const { id } = req.params;
  const resignDate = new Date();
  const status = req.body.status;

  const existingEmployee = await AssetLender.findOne({ employeeID });
  if (existingEmployee) {
  }
};

//-----------------------------------------------

//-----------create recently joined section------

//-----------------------------------------------

//------------create organization structure------

//-----------------------------------------------

//---assign & remove team members, team leads----

//-----------------------------------------------

//-----------employee profile progress----------

//----------------------------------------------
