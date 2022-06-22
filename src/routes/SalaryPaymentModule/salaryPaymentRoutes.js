const express = require("express");
const router = express.Router();
// const verify = require("../../middleware/VerifyJWT");
// const verifyRoles = require("../../middleware/verifyUserRole");
// const userRoles = require("../../Config/UserRoles");


//importing controllers of currunt salary payment
const {
    viewCurrentSalarySheet,
    createCurrentSalarySheet,
    findCurrentSalarySheet,
    updateCurrentSalarySheet,
    deleteCurrentSalarySheet,
    createSalaryPercentages,
    viewSalaryRates
} = require("../../controllers/salaryPaymentSection/currentSalarySheetControllers");



//importing controllers of summary salary payment
const {
    viewSummarySalarySheet,
    findSummarySalarySheetByEid
} = require("../../controllers/salaryPaymentSection/summarySalaryController");



//importing controllers of employee salary payment
const {
    viewCurrentEmployeeSalarySheet,
    findEmployeeSalarySheet
} = require("../../controllers/salaryPaymentSection/employeeSalarysheetController");


// routes for the currunt salary payment
router.get('/currentSalary', viewCurrentSalarySheet);
router.post('/currentSalary/create', createCurrentSalarySheet);
router.get('/currentSalary/:EmployeeID', findCurrentSalarySheet);//
router.patch('/currentSalary/update/:EmployeeID', updateCurrentSalarySheet);//check
router.delete('/currentSalary/delete/:EmployeeID', deleteCurrentSalarySheet);


//routes for salary rates
router.post('/salaryPercentages/create/:EmployeeID', createSalaryPercentages);
router.get('/salaryPercentages/:EmployeeID', viewSalaryRates);




// routes for the summary salary payment
router.get('/summarySalary', viewSummarySalarySheet);
router.get('/summarySalary/:EmployeeID', findSummarySalarySheetByEid);//



// routes for the employee salary sheet
router.get('/employeeSalary/:EmployeeID', viewCurrentEmployeeSalarySheet);
router.get('/employeeSalary/:EmployeeID/previous', findEmployeeSalarySheet);


module.exports = router;
