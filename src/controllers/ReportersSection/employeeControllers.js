const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const academicQualificaationSchema = require("../../models/ReportersManagementModule/AcademicQualificaationModel");
const ProffesionalQualificationSchema = require("../../models/ReportersManagementModule/ProffesionalQualificationModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const productSchema = require("../../models/ReportersManagementModule/ProductModel");
const { findOne } = require("../../models/ReportersManagementModule/EmployeeModel");
const sensitiveDetailsSchema=require("../../models/ReportersManagementModule/SensitiveDetailsModel");
const candidateSchema = require('../../models/RecruitmentModule/CandidateModel');

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
  const{
    employeeID ,
  employeeFirstName,
  employeeLastName ,
 /* const birthday = req.body.birthday;
  const streetNo = req.body.streetNo;
  const city = req.body.city;
  const phoneNumber = req.body.phoneNumber;*/
  jobRole ,
    NIC ,
  companyEmail,
  status ,
  /*const joinDate = new Date();*/
  /*const resignDate = new Date();*/
  jobType 
}=req.body;


 /* const teamID = req.body.teamID;*/

  //const joinedDate=new Date();

//----------create username & password---------------------------
const username=employeeFirstName+"."+employeeID;
const password=NIC;


  const salt = await bcrypt.genSalt();
  const encryptedPassword=await bcrypt.hash(password, salt);

  const candidate = await candidateSchema.findOne({NIC});

  const newEmployee = new employeeSchema({
    employeeID,
    employeeFirstName,
    employeeLastName,
    /*birthday,
    streetNo,
    city,
    phoneNumber,*/
    jobRole,
    NIC,
    companyEmail,
    status,
    //joinDate:joinedDate,
    //resignDate,
    jobType,
    candidateID : candidate._id,
   // teamID,
  });

  const sensitiveDetails= new sensitiveDetailsSchema({
    username,password:encryptedPassword,employeeID
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

    await sensitiveDetails.save().then(() => {
      res.json("Sensitive Details has successfully added!");
    })
    .catch((err) => {
      res.status(400).json({ message: "Sensitive Details are not Added!" });
      console.log(err);
    });
};


//--------Update academic qualification----------------
exports.updateEmployeeProfile = async (req, res) => {
  const {id} = req.params;
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
     course 
  } = req.body;

  const newAcademicQualification = new academicQualificaationSchema({
    //academicQualificationID,
    employeeID:id,
    ordinaryLevelResult,
    advancedLevelResults,
    achievements,
  });

  const employee  = {   
    employeeID:id,
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
    jobType
   // candidateID : candidate._id,
  }
const proffesional={
  employeeID:id,
  degree, 
  language,
   course 
}
 

//--------------academic qualification update-------------------------------------
const academicQualification= await academicQualificaationSchema.findOne({id});
if(! academicQualification){
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
  }
  await academicQualificaationSchema.findByIdAndUpdate(id,newAcademicQualification, {new : true}) .then(() => {
    res.json("Academic Qualifictions added successfully!");
  })
  .catch((err) => {
    res
      .status(400)
      .json({ message: "Academic Qualifictions added successfully!" });
  });

//-------------proffesional qualification update------------------------------

const proffesionalQualification= await ProffesionalQualificationSchema.findOne({employeeID:id});
if(! proffesionalQualification){
  await proffesional
    .save()
    .then(() => {
      res.json("Proffesional Qualifictions added successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Proffesional Qualifictions are not added!" });
    });
  }
  await academicQualificaationSchema.findByIdAndUpdate(id,proffesional, {new : true}) .then(() => {
    res.json("Proffesional Qualifictions added successfully!");
  })
  .catch((err) => {
    res
      .status(400)
      .json({ message: "Proffesional Qualifictions added successfully!" });
  });

//-----------update employee details-------------------------------
 await employeeSchema.findByIdAndUpdate(id, employee, {new : true}) .then(() => {
      res.json("Employee Updated successfully!");
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Employee is not updated!" });
    });
};
//------------------------------------------------------------
//------------------------------------------------------------

/* 
 const existingEmployee = await employeeSchema
    .findOne({ employeeID });
if(existingEmployee){
      return res.status(400).json({ message: "Employee already exists" });
    }
    */

//--------Add Proffesional qualification----------------
exports.addProffesionalQualification = async (req, res) => {
  const { employeeID, degree, language, course } =
    req.body;

  newProffesionalQualification = new ProffesionalQualificationSchema({
 
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

//-------View Team-----------------------------

exports.viewTeam = async (req,res)=>{
  await teamSchema.find().then((team)=>{
      res.json(team)
  }).catch((err)=>{
      console.log(err)
  })
}


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
