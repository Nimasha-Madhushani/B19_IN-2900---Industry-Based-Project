const express = require("express");
const router = express.Router();


//importing controllers of currunt salary payment
const {
    viewCurrentSalarySheet,
    createCurrentSalarySheet,
    findCurrentSalarySheet,
    updateCurrentSalarySheet,
    deleteCurrentSalarySheet,
    // sendToSummarySalarySheet
} = require("../../controllers/salaryPaymentSection/currentSalarySheetControllers");



//importing controllers of summary salary payment
const {
    viewSummarySalarySheet,
    findSummarySalarySheetByEid
} = require("../../controllers/salaryPaymentSection/summarySalaryController");



//importing controllers of employee salary payment
const {
    viewCurrentEmployeeSalarySheet,
    findEmployeeSalarySheetByMonth
} = require("../../controllers/salaryPaymentSection/employeeSalarysheetController");


// routes for the currunt salary payment
router.get('/currentSalary/', viewCurrentSalarySheet); //view all current payments
router.post('/currentSalary/create', createCurrentSalarySheet);
router.get('/currentSalary/:EmployeeID', findCurrentSalarySheet);
router.patch('/currentSalary/update/:EmployeeID', updateCurrentSalarySheet);
router.delete('/currentSalary/delete/:EmployeeID', deleteCurrentSalarySheet);
//router.post('/currentSalary/sendToSummary', sendToSummarySalarySheet);




// routes for the summary salary payment
router.get('/summarySalary/', viewSummarySalarySheet); //view all summary payments
router.get('/summarySalary/:EmployeeID', findSummarySalarySheetByEid);



// routes for the employee salary sheet
router.get('/employeeSalary/:EmployeeID', viewCurrentEmployeeSalarySheet); //view all summary payments
router.get('/employeeSalary/:EmployeeID/:Month', findEmployeeSalarySheetByMonth);



module.exports = router;
