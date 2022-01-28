const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    required: [true, "Please enter the team ID"],
  },
  teamName: {
    type: String,
    required: [true, "Please enter the team name"],
  },
  teamLeadID: {
    type: String,
    required: [true, "Please enter the  team lead ID"],
  },
});

module.exports = mongoose.model("Team", teamSchema);
