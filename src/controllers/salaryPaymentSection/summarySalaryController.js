//controllers for all summary salary sheets of all employees
let summarySheet = require("../../models/SalaryPaymentModule/SummarySalary");

//view all salary summary sheets of all employees
exports.viewSummarySalarySheet = async (req, res) => {
    try {
        const summarySalarySheets = await summarySheet.find();
        res.status(200).json(summarySalarySheets);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


//find Summary Salary Sheet by employee id
exports.findSummarySalarySheetByEid = async (req, res) => {
    try {
        const employeeSummarySlarySheet = await summarySheet.find({ 'EmployeeID': req.params.EmployeeID });
        res.status(200).json(employeeSummarySlarySheet);
    } catch (error) {
        res.status(400).send({ message: "Fault Employee ID", error: err.message });
    }
}


