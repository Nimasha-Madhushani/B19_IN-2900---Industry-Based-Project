const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const academicQualificaationSchema = require("../../models/ReportersManagementModule/AcademicQualificaationModel");
const ProffesionalQualificationSchema = require("../../models/ReportersManagementModule/ProffesionalQualificationModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const productSchema = require("../../models/ReportersManagementModule/ProductModel");

//const candidateSchema = require('../../models/RecruitmentModule/CandidateModel');

//-------View Employees-----------------------------

exports.viewEmployees = async (req,res)=>{
  await employeeSchema.find().then((employees)=>{
      res.json(employees)
  }).catch((err)=>{
      console.log(err)
  })
}

//-------Create Employee Profile--------------------

exports.createEmployee = async (req, res) => {
  const employeeID = req.body.employeeID;
  const employeeFirstName = req.body.employeeFirstName;
  const employeeLastName = req.body.employeeLastName;
  const birthday = req.body.birthday;
  const streetNo = req.body.streetNo;
  const city = req.body.city;
  const phoneNumber = req.body.phoneNumber;
  const jobRole = req.body.jobRole;
  const NIC = req.body.NIC;
  const companyEmail = req.body.companyEmail;
  const status = req.body.status;
  const joinDate = new Date();
  const resignDate = new Date();
  const jobType = req.body.jobType;
  const candidateID = req.body.candidateID;
  const teamID = req.body.teamID;

  const newEmployee = new employeeSchema({
    employeeID,
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
    joinDate,
    resignDate,
    jobType,
    candidateID,
    teamID,
  });
   /*
    const existsCandidate = await candidateSchema.findOne({ NIC });
    if (existsCandidate) {
      return res.status(400).json({ message: "candidate already exists" });
    }*/
  /*
  if (status == "resigned") {
    const resignDate = String(req.body.resignDate);
  }*/

  await newEmployee
    .save()
    .then(() => {
      res.json("Employee has successfully added!");
    })
    .catch((err) => {
      res.status(400).json({ message: "Employee is not Added!" });
      console.log(err);
    });
};

//--------Add academic qualification----------------
exports.addAcademicQualification = async (req, res) => {
  const {
    academicQualificationID,
    employeeID,
    ordinaryLevelResult,
    advancedLevelResults,
    achievements,
  } = req.body;

  newAcademicQualification = new academicQualificaationSchema({
    academicQualificationID,
    employeeID,
    ordinaryLevelResult,
    advancedLevelResults,
    achievements,
  });

  await newAcademicQualification
    .save()
    .then(() => {
      res.json("Academic Qualifictions added successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Academic Qualifictions are not added!" });
    });
};

/* 
 const existingEmployee = await employeeSchema
    .findOne({ employeeID });
if(existingEmployee){
      return res.status(400).json({ message: "Employee already exists" });
    }
    */

//--------Add Proffesional qualification----------------
exports.addProffesionalQualification = async (req, res) => {
  const { proffesionalQualificationID, employeeID, degree, language, course } =
    req.body;

  newProffesionalQualification = new ProffesionalQualificationSchema({
    proffesionalQualificationID,
    employeeID,
    degree,
    language,
    course,
  });

  await newProffesionalQualification
    .save()
    .then(() => {
      res.json("Proffesional Qualifictions added successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Proffesional Qualifictions are not added!" });
    });
};

//---------------add team-------------------

exports.addTeam = async (req, res) => {
  const { teamID,teamName,teamLeadID } =
    req.body;

  newTeam = new teamSchema({
    teamID,teamName,teamLeadID
  });
  

  await newTeam
    .save()
    .then(() => {
      res.json("Team added successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Team is not added!" });
    });

}
/*
try{
  const existingTeamLead = await employeeSchema.findOne({ employeeID });
  if (existingTeamLead) {
  
  await newTeam
    .save()
    .then(() => {
      res.json("Team added successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Team is not added!" });
    });
}
  }catch{
  
      res.status(500).send({message:"Cannot create team!"})
    
  }*/

//---------------add product----------------
exports.addProduct = async (req, res) => {

    const productID=req.body.productID;
    const productName=req.body.productName;
    const description=req.body.description;
    const recievedDate=new Date();
    const launchDate=req.body.launchDate;
    const teamID=req.body.teamID;
  

  newProduct = new productSchema({
    productID,
    productName,
    description,
    recievedDate,
    launchDate,
    teamID,
  });

  const existingTeam = await teamSchema.findOne({ teamID });
  if (existingTeam) {
  

  await newProffesionalQualification
    .save()
    .then(() => {
      res.json("product is added successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "product is not added!" });
    });
  }
  else{
    res.status(500).send({message:"Cannot add product!"})
  }
}

//-----------assign product------------------------
