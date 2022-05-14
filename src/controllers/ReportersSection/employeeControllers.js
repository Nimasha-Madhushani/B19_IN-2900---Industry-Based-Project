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

//-------SearchEmployee to update------------------

// exports.filterEmployee = async (req, res) => {
//   const id = req.params.empId;
//   let employee;
//   try {
//     employee = await employeeSchema.findById(id);
//   } catch (err) {
//     console.log(err);
//   }
//   if (!employee) {
//     return res.status(400).json({ message: "Employee is not existing" });
//   } else {
//     return res.status(200).json({ employee: employee });
//   }
// };

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
          } = employee;
          employees.push({
            employeeID,
            employeeName: employeeFirstName + " " + employeeLastName,
            profilePic,
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
    res.status(200).json({ data: collectionOne });
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
    status,
    jobType,
  } = req.body;

  try {
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
        status,
        jobType,
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
        res.status(200).json("Employee and Sensitive Details are Added!");
      }
    } else {
      res.status(400).json({
        message: "Employee or sensitive details is Duplicated!",
      });
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
  };
  try {
    console.log(req);

    const existingEmployee = await employeeSchema.findOne({ employeeID: id }); //???????
    // console.log(existingEmployee);

    const candidate = await candidateSchema.findOne({
      _id: existingEmployee.candidateID,
    });
    //console.log(candidate);
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
      });
    } else {
      res.status(400).json("Employee is not existing");
    }
  } catch (err) {
    res.status(400).json({
      message:
        "employee profile,academic qulification, proffesional qualification are not updated",
      err: err.message,
    });
  }
};

//------------create organization structure------

//-----------employee profile progress----------
