//controllers for current month salary sheets of all employees

let summarySheet = require("../../models/SalaryPaymentModule/SummarySalary");
let CurrentSheet = require("../../models/SalaryPaymentModule/CurrentSalary");
const Employee = require("../../models/ReportersManagementModule/EmployeeModel");



//display Current Salary Sheet by employee id on current salary table
exports.viewCurrentEmployeeSalarySheet = async (req, res) => {
    try {
        const eid = req.params.EmployeeID;

        const existsEmployeeId = await Employee.findOne({ employeeID: eid });
        if (existsEmployeeId == null) {
            return res.status(400).json({ message: "Invalid EmployeeID. Enter a valid employee ID" });
        }

        const currentEmployeeSalarySheets = await CurrentSheet.find({ 'EmployeeID': req.params.EmployeeID });
        if (currentEmployeeSalarySheets == null) {
            return res.status(400).json({ message: "Current salary sheet not found" });
        }
        //res.status(200).json({ message: "Successfull", currentEmployeeSalarySheets });
        res.status(200).json(currentEmployeeSalarySheets);
        //console.log(currentEmployeeSalarySheets)
    } catch (error) {
        res.status(404).json({ message: "Error", error })
    }
}

//finds employee salary sheets by month on summary salary table
// exports.findEmployeeSalarySheetByMonth = async (req, res) => {
//     try {
//         console.log("2")
//         const eid = req.params.EmployeeID;
//         const month = req.params.Month;

//         const existsEmployeeId = await Employee.findOne({ employeeID: eid });
//         if (existsEmployeeId == null) {
//             return res.status(400).json({ message: "Invalid EmployeeID. Enter a valid employee ID" });
//         }

//         const employeeMonthlySalarySheet = await summarySheet.find({ EmployeeID: eid, Month: month });
//         if (employeeMonthlySalarySheet == null) {
//             return res.status(400).json({ message: "Salary sheet not found" });
//         }
//         res.status(200).json({ message: "Successfull", employeeMonthlySalarySheet });
//     } catch (error) {
//         res.status(500).send({ message: "Invalid Employee ID or Month", error: err.message });
//     }
// }

//
exports.findEmployeeSalarySheet = async (req, res) => {

    const eid = req.params.EmployeeID;

    try {
        const existsEmployeeId = await Employee.findOne({ employeeID: eid });
        if (existsEmployeeId == null) {
            return res.status(400).json({ message: "Invalid EmployeeID. Enter a valid employee ID" });
        }

        const employeeSalarySheet = await summarySheet.find({ EmployeeID: eid });
        if (employeeSalarySheet == null) {
            return res.status(400).json({ message: "Salary sheet not found" });
        }
        res.status(200).json(employeeSalarySheet);

    } catch (error) {
        res.status(500).send({ message: "Invalid Employee ID or Month", error: err.message });
    }
}

