const mongoose = require("mongoose");
const { response } = require("express");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const { find } = require("../../models/ReportersManagementModule/EmployeeModel");

module.exports.getEmployees = async(req,res) => {
    
    try {

        
        const employees = await employeeSchema.find({jobRole: {$ne: "HR Manager"}});
        
         res.status(200).json({
            message: "Employees are successfully fetched",
            NonHrEmployees:employees,
        });


    
    } catch (error) {
         res.status(400).json({
            message: "employees are failed to fetched",
            error: error.message,
          });

        
    }

};