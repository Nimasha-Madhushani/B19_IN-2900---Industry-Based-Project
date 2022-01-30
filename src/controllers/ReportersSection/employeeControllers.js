const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const academicQualificaationSchema = require("../../models/ReportersManagementModule/AcademicQualificaationModel");
const ProffesionalQualificationSchema = require("../../models/ReportersManagementModule/ProffesionalQualificationModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const productSchema = require("../../models/ReportersManagementModule/ProductModel");
const {
  findOne,
} = require("../../models/ReportersManagementModule/EmployeeModel");
const sensitiveDetailsSchema = require("../../models/ReportersManagementModule/SensitiveDetailsModel");
const candidateSchema = require("../../models/RecruitmentModule/CandidateModel");

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

//---------------add team-------------------

exports.addTeam = async (req, res) => {
  const { teamID, teamName, teamLeadID } = req.body;

  newTeam = new teamSchema({
    teamID,
    teamName,
    teamLeadID,
  });

  await newTeam
    .save()
    .then(() => {
      res.json("Team added successfully!");
    })
    .catch((err) => {
      res.status(400).json({ message: "Team is not added!" });
    });
};
//-----------------------------------------

//--------------update team----------------

exports.updateTeam = async (req, res) => {
  const { id } = req.params;

  const { teamID, teamName, teamLeadID } = req.body;

  newTeamUpdate = {
    teamID,
    teamName,
    teamLeadID,
  };
  const existingTeam = await teamSchema.findById(id);
  if (existingTeam) {
    await teamSchema
      .findByIdAndUpdate(existingTeam._id, newTeamUpdate, { new: true })
      .then(() => {
        res.json("team is updated successfully!");
      })
      .catch((err) => {
        res.status(400).json({ message: "team is not updated!" });
      });
  }
};
//--------------------------------------------

//-------View Team-----------------------------

exports.viewTeam = async (req, res) => {
  await teamSchema
    .find()
    .then((team) => {
      res.json(team);
    })
    .catch((err) => {
      console.log(err);
    });
};

//---------------add product----------------
exports.addProduct = async (req, res) => {
  const productID = req.body.productID;
  const productName = req.body.productName;
  const description = req.body.description;
  const recievedDate = new Date();
  //const launchDate=req.body.launchDate;
  const teamID = req.body.teamID;

  newProduct = new productSchema({
    productID,
    productName,
    description,
    recievedDate,
    // launchDate,
    teamID,
  });

  const existingTeam = await teamSchema.findOne({ teamID });
  if (existingTeam) {
    await newProduct
      .save()
      .then(() => {
        res.json("product is added successfully!");
      })
      .catch((err) => {
        res.status(400).json({ message: "product is not added!" });
      });
  } else {
    res.status(500).send({ message: "Cannot add product!" });
  }
};
//--------------------------------------------------

//-----------update product------------------------

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  const productID = req.body.productID;
  const productName = req.body.productName;
  const description = req.body.description;
  // const recievedDate=new Date();
  //const launchDate=req.body.launchDate;
  const teamID = req.body.teamID;

  newProductUpdate = {
    productID,
    productName,
    description,
    // recievedDate,
    /// launchDate,
    teamID,
  };

  const existingProduct = await productSchema.findById(id);
  if (existingProduct) {
    await productSchema
      .findByIdAndUpdate(id, newProductUpdate)
      .then(() => {
        res.json("product is updated successfully!");
      })
      .catch((err) => {
        res.status(400).json({ message: "product is not updated!" });
      });
  }
};
//-----------------------------------------------