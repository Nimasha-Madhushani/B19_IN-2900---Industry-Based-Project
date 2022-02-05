//controllers for all summary salary sheets of all employees
// const mongoose = require("mongoose");



let summarySheet = require("../../models/SalaryPaymentModule/SummarySalary");


//view all current salary sheets
// exports.viewSummarySalarySheet = async (req, res) => {
//     await summarySheet.find().then((summarySalarySheets) => {
//         res.json(summarySalarySheets)
//     }).catch((err) => {
//         console.log(err);
//         res.status(500).send(
//             { error: err.message }
//         );
//     })
// };

exports.viewSummarySalarySheet = async (req, res) => {
    await summarySheet.find().then((summarySalarySheets) => {
        res.json(summarySalarySheets);
        return res.status(200);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(error.message);
    })
};


//find Summary Salary Sheet by employee id
exports.findSummarySalarySheet = async (req, res) => {
    // const employeeSummarySlarySheet = 
    await summarySheet.find(
        { 'EmployeeID': req.params.EmployeeID })
        .then((employeeSummarySlarySheet) => {
            res.json(employeeSummarySlarySheet)
        }).catch((err) => {
            console.log(err);
            res.status(500).send(
                { message: "Fault Employee ID", error: err.message }
            )
        })
}



