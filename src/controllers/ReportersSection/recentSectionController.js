const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
module.exports.recentSection = async (req, res) => {
  try {
    const Count = await employeeSchema.count();

    const recent = await employeeSchema.find().skip(Count <= 5 ? 0 : Count - 5);
    res.status(200).json({ state: true, data: recent });
  } catch {
    res.status(400).json({ state: false });
  }
};



