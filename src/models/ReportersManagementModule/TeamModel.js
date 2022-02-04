const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    /*teamID: {
      type: String,
      required: true,
    },*/
    teamName: {
      type: String,
      required: true,
    },
    teamLeadID: {
      type: String,
      required: true,
    },
    //--------------------
   /* teamMembers:{
      type:Array
    }*/
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
