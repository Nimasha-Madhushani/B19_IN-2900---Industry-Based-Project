//controllers for current month salary sheets of all employees
const mongoose = require("mongoose");

let summarySheet = require("../../models/SalaryPaymentModule/SummarySalary");
let CurrentSheet = require("../../models/SalaryPaymentModule/CurrentSalary");


//find Current Salary Sheet by employee id on current salry table
exports.viewCurrentEmployeeSalarySheet = async (req, res) => {
    //  const employeeSalarySheet = 
    await CurrentSheet.find(
        { 'EmployeeID': req.params.EmployeeID })
        .then((currentEmployeeSalarySheets) => {
            res.json(currentEmployeeSalarySheets)
        }).catch((err) => {
            console.log(err);
        })
}

//finds employee salary sheets by month on summary salry table
exports.findEmployeeSalarySheetByMonth = async (req, res) => {
    //const employeeMonthlySalarySheet = 
    await summarySheet.find(
        {
            'EmployeeID': req.params.EmployeeID,
            'Month': req.params.Month,
        })
        .then((employeeMonthlySalarySheet) => {
            res.json(employeeMonthlySalarySheet)
        }).catch((err) => {
            console.log(err);
            res.status(500).send(
                { message: "Fault Employee ID and Month", error: err.message }
            )
        })
}

