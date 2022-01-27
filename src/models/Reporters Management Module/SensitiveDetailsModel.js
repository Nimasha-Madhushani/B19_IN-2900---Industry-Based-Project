const mongoose = require("mongoose");

const sensitiveDetailsSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter the user name"],
  },
  accessLevel: {
    type: String,
    required: [true, "Please enter the access level"],
  },
  password: {
    type: String,
    required: [true, "Please enter the  team password"],
  },
  employeeID: {
    type: String,
    required: [true, "Please enter the employee ID"],
  },
});

module.exports = mongoose.model("SensitiveDetails", sensitiveDetailsSchema);
