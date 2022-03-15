const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");

//------------update last seen of employees-----------------------

//-------------view last seen of employees------------------------
exports.displayLastSeen = async (req, res) => {
  try {
    const findEmployees = await employeeSchema.find();
    let lastSeenArr = new Array();

    await Promise.all(
      findEmployees.map(async (filterEmployees) => {
        {
          const {
            employeeLastName,
            jobRole,
            NIC,
            companyEmail,
            status,
            jobType,
            candidateID,
            createdAt,
            updatedAt,
            phoneNumber,
            profilePic,
            streetNo,
            birthday,
            city,
            teamID,
            token,
            ...others
          } = filterEmployees.toObject();
          lastSeenArr.push(others);
          // console.log(others);
        }
      })
    );

    res.send(lastSeenArr);
  } catch (err) {
    res.status(404).json({
      message: "Can't display lastseen of employees",
      err: err.message,
    });
  }
};
