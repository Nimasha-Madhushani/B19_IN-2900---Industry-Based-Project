//controllers for current month salary sheets of all employees
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");

const { options } = require("nodemon/lib/config");
const CurrentSheet = require("../../models/SalaryPaymentModule/CurrentSalary");
const SummarySalarySchema = require("../../models/SalaryPaymentModule/SummarySalary");



//view all current salary sheets
exports.viewCurrentSalarySheet = async (req, res) => {
    await CurrentSheet.find().then((currentSalarySheets) => {
        res.json(currentSalarySheets)
    }).catch((err) => {
        console.log(err)
    })
}



//create Current Salary Sheets
exports.createCurrentSalarySheet = async (req, res) => {


    const { CurrentSalarySheetID, EmployeeID, BasicSalary, VehicleAllowance, InternetAllowance } = req.body;


    const ETF = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.03;
    const CompanyEPF = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.12;
    const EmoloyeeEpf = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) * 0.08;
    const NetSalary = (req.body.BasicSalary + req.body.InternetAllowance + req.body.VehicleAllowance) - ETF - CompanyEPF - EmoloyeeEpf;


    const newCurrentSalarySheet = new CurrentSheet({
        CurrentSalarySheetID, EmployeeID, BasicSalary, VehicleAllowance, InternetAllowance, EmoloyeeEpf, NetSalary, CompanyEPF, ETF
    });

    const duplicateSalarySheetID = await CurrentSheet.findOne({ CurrentSalarySheetID });
    if (duplicateSalarySheetID) {
        return res.status(400).json({ message: "Current Salary sheet ID already exists" });
    }
    const duplicateEmployeeID = await CurrentSheet.findOne({ EmployeeID });
    if (duplicateEmployeeID) {
        return res.status(400).json({ message: "Salary sheet  for this EmployeeID already exists. You have to edit it" });
    }

    await newCurrentSalarySheet.save().then(() => {
        res.json("Salary details has successfully added!")
    }).catch((err) => {
        res.status(400).json({ message: "Salary details not inserted!", error: err.message });
    })
}



//find Current Salary Sheet by employee id
exports.findCurrentSalarySheet = async (req, res) => {

    await CurrentSheet.find(
        { 'EmployeeID': req.params.EmployeeID })
        .then((employeeSlarySheets) => {
            res.json(employeeSlarySheets)
        }).catch((err) => {
            console.log(err);
            res.status(500).send({ error: err.message })
        })

}


//update cureent employee salary sheet
exports.updateCurrentSalarySheet = async (req, res) => {
    var empID = req.params.EmployeeID;

    CurrentSheet.findOne({ EmployeeID: empID }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundObject) {
                res.status(404).send();
            } else {

                if (req.body.CurrentSalarySheetID) {
                    foundObject.CurrentSalarySheetID = req.body.CurrentSalarySheetID;
                }

                if (req.body.EmployeeID) {
                    foundObject.EmployeeID = req.body.EmployeeID;
                }

                if (req.body.BasicSalary) {
                    foundObject.BasicSalary = req.body.BasicSalary;
                }

                if (req.body.VehicleAllowance) {
                    foundObject.VehicleAllowance = req.body.VehicleAllowance;
                }

                if (req.body.InternetAllowance) {
                    foundObject.InternetAllowance = req.body.InternetAllowance;
                }

                if (req.body.EmoloyeeEpf) {
                    foundObject.EmoloyeeEpf = req.body.EmoloyeeEpf;
                }

                if (req.body.NetSalary) {
                    foundObject.NetSalary = req.body.NetSalary;
                }

                if (req.body.CompanyEPF) {
                    foundObject.CompanyEPF = req.body.CompanyEPF;
                }

                if (req.body.ETF) {
                    foundObject.ETF = req.body.ETF;
                }

                foundObject.save(function (err, updatedObject) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(
                            { message: "Fail to update", error: err.message }
                        );
                    } else {
                        res.send(updatedObject);
                    }
                });
            }
        }
    });

}

//delete current salry record
exports.deleteCurrentSalarySheet = async (req, res) => {
    var empID = req.params.EmployeeID;

    CurrentSheet.findOneAndDelete({ EmployeeID: empID }, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(
                { message: "Error", error: err.message }
            );
        } else {
            return res.status(200).send({ message: "Successfully deleted" });
        }
    });
};


//send data to summary salary sheetsl
exports.sendToSummarySalarySheet = async (req, res) => {
    // const result = await CurrentSheet.find();
    // const existingSheetList = await CurrentSheet.find(); // TODO
    await CurrentSheet.find();

    const date = new Date(); // TODO

    const Year = date.getFullYear();
    const Month = date.getMonth();


    const requestBody = req.body; // TODO

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

    })

    //console.log(newSummarySalarySheet);

    // let result1 = Object.assign({}, result);
    // console.log(result1);

    // await newSummarySalarySheet.save({ result: result1[result] }).then(() => {
    //     res.json("Salary details has successfully added to summary table")
    // }).catch((err) => {
    //     res.status(400).json({ message: err.message });
    // })
    // var db = require('../../Config/connectDataBase');
    // await db.summarysalaries.insertMany(result1).then(() => {
    //     res.json("Salary details has successfully added to summary table")
    // }).catch((err) => {
    //     res.status(400).json({ message: err.message });
    // })
    // await newSummarySalarySheet.insertMany(result1).then(() => {
    //     res.json("Salary details has successfully added to summary table")
    // }).catch((err) => {
    //     res.status(400).json({ message: err.message });
    // })


    // for (var i in result1) {
    //     await newSummarySalarySheet.save(result1[i]);
    // }
    await SummarySalarySchema.insertMany(newSummarySalarySheet).then(() => {
        res.json("Salary details has successfully added to summary table")
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });

};

