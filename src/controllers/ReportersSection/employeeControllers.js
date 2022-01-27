const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const router = require("../../routes/employeeRoutes");


//-------Create Employee Profile--------------------

router.route("/create").post(async(req, res) => {
  const {
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
    lastLogin,
    joinDate,
    resignDate,
    jobType,
    candidateID,
    teamID,
  } = req.body; //destructure

  const newEmployee= new employeeSchema({
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
    lastLogin,
    joinDate,
    resignDate,
    jobType,
    candidateID,
    teamID,
  });

/*
  newEmployee.save().then(()=>{
      res.json("Employee Added");
  }).catch((err)=>{
      console.log(err);
  })
  */
});
