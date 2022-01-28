const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    required: true, 
  },
  teamName: {
    type: String,
    required: true
  },
  teamLeadID: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Team", teamSchema);
