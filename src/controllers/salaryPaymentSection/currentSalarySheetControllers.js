//controllers for current month salary sheets of all employees

const schedule = require('node-schedule');

const CurrentSheet = require("../../models/SalaryPaymentModule/CurrentSalary");
const SummarySalarySchema = require("../../models/SalaryPaymentModule/SummarySalary");
const Employee = require("../../models/ReportersManagementModule/EmployeeModel");


//view all current salary sheets
exports.viewCurrentSalarySheet = async (req, res) => {
    try {
        const currentSalarySheet = await CurrentSheet.find();
        if (!currentSalarySheet) {
            res.status(404).json({ message: "Current salary sheets not foundmmm", error: err.message })
        }
        res.status(200).json(currentSalarySheet);
        // console.log("view current salary sheet executed")
    } catch (err) {
        res.status(404).json({ message: "Current salary sheets not found", error: err.message })
    }
}

//create a new current salary sheet
exports.createCurrentSalarySheet = async (req, res) => {

    const { EmployeeID, BasicSalary, VehicleAllowance, InternetAllowance } = req.body;

    if (req.body.EmployeeID == null || req.body.BasicSalary === null || req.body.VehicleAllowance == null || req.body.InternetAllowance == null) {
        return res.status(200).json({ message: "please fill all fields", success: false });
    }

    const ETF = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.03;
    const CompanyEPF = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.12;
    const EmoloyeeEpf = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.08;
    const NetSalary = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) - ETF - CompanyEPF - EmoloyeeEpf;

    const newCurrentSalarySheet = new CurrentSheet({
        EmployeeID, BasicSalary, VehicleAllowance, InternetAllowance, EmoloyeeEpf, NetSalary, CompanyEPF, ETF
    });
    try {
        const duplicateEmployeeID = await CurrentSheet.findOne({ EmployeeID });

        if (duplicateEmployeeID) {
            return res.status(200).json({ message: "Salary sheet for this EmployeeID already exists. You have to edit it", success: false });
        }

        const existsEmployeeId = await Employee.findOne({ employeeID: EmployeeID });
        await newCurrentSalarySheet.save();
        res.status(200).json({ message: "Salary details has successfully added!", success: true });
    } catch (error) {
        res.status(400).json({ message: "Salary details not inserted!", success: false });
    }
}


//find Current Salary Sheet by employee id
exports.findCurrentSalarySheet = async (req, res) => {
    const employeeId = req.params.EmployeeID
    try {

        const existsEmployeeId = await Employee.findOne({ employeeID: employeeId });
        if (existsEmployeeId == null) {
            return res.status(400).json({ message: "Invalid EmployeeID. Enter a valid employee ID" });
        }

        const employeeSlarySheets = await CurrentSheet.findOne({ EmployeeID: employeeId });
        console.log(employeeSlarySheets);
        if (employeeSlarySheets == null) {
            return res.status(404).json({ message: "Current salary sheet for given Employee ID not found" });
        }

        //res.status(200).json({ message: "Successsfull", employeeSlarySheets })
        res.status(200).json(employeeSlarySheets);

    } catch (err) {
        res.status(404).json({ message: "Error", err: err.message });
    }
}

exports.updateCurrentSalarySheet = async (req, res) => {
    var empID = req.params.EmployeeID;

    const employeeToBeUpdated = await CurrentSheet.findOne({ EmployeeID: empID });

    if (employeeToBeUpdated === null) {
        return res.status(404).json({ success: false });
    }
    try {
        const filter = { EmployeeID: empID };
        const update = req.body;

        const ETF = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.03;
        const CompanyEPF = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.12;
        const EmoloyeeEpf = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.08;
        const NetSalary = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) - ETF - CompanyEPF - EmoloyeeEpf;

        const newData = {
            BasicSalary: req.body.BasicSalary,
            InternetAllowance: req.body.InternetAllowance,
            VehicleAllowance: req.body.VehicleAllowance,
            ETF: ETF,
            CompanyEPF: CompanyEPF,
            EmoloyeeEpf: EmoloyeeEpf,
            NetSalary: NetSalary
        }
        // let updateData = await CurrentSheet.findOneAndUpdate(filter, update);
        let updateData = await CurrentSheet.findOneAndUpdate(filter, newData);
        //console.log("updateData", updateData);
        return res.status(200).json({ message: "SUccessfully updated current salary sheet", success: true });
    } catch (error) {
        return res.status(400).json({ message: "Fail to update", success: false });
    }
};


//delete current salary record 
exports.deleteCurrentSalarySheet = async (req, res) => {
    // console.log("1");
    var empID = req.params.EmployeeID;
    // console.log(req.params.EmployeeID);
    try {
        const deleteSalarySheet = await CurrentSheet.findOne({ EmployeeID: empID });
        if (deleteSalarySheet == null) {
            res.status(404).send({ message: "Invalid employee ID" });
        }
        await CurrentSheet.findOneAndDelete({ EmployeeID: empID });
        // return res.status(200).send({ message: "Successfully deleted", deleteSalarySheet });
        return res.status(200);
    } catch (err) {
        res.status(404).send({ error: err.message });
    }
};


// send data to summary salary sheet
const job = schedule.scheduleJob('0 0 26 * * ', async function (req, res) {

    const requestBody = await CurrentSheet.find();

    const date = new Date();

    const Year = date.getFullYear();
    let Month = date.toLocaleString('en-us', { month: 'long' });

    try {

        if (!requestBody) {
            console.log("no body");
        }
        const newSummarySalarySheet = requestBody.map(function (summary) {
            return new SummarySalarySchema({
                'CurrentSalarySheetID': summary.CurrentSalarySheetID,
                'EmployeeID': summary.EmployeeID,
                'Year': Year,
                'Month': Month,
                'BasicSalary': summary.BasicSalary,
                'VehicleAllowance': summary.VehicleAllowance,
                'InternetAllowance': summary.InternetAllowance,
                'EmoloyeeEpf': summary.EmoloyeeEpf,
                'NetSalary': summary.NetSalary,
                'CompanyEPF': summary.CompanyEPF,
                'ETF': summary.ETF,
            });
        });
        await SummarySalarySchema.insertMany(newSummarySalarySheet);
        console.log("inserted");

    } catch (err) {
        console.log("error occured");
    }
    console.log('Salary details has successfully added to summary table at ' + Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' }));
});


