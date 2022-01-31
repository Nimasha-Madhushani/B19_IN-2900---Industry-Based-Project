const mongoose = require("mongoose");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");

//---------------add team-------------------

exports.addTeam = async (req, res) => {
    const { teamID, teamName, teamLeadID } = req.body;
  
    newTeam = new teamSchema({
      teamID,
      teamName,
      teamLeadID,
    });
  
    await newTeam
      .save()
      .then(() => {
        res.json("Team added successfully!");
      })
      .catch((err) => {
        res.status(400).json({ message: "Team is not added!" });
      });
  };
  //-----------------------------------------
  
  //--------------update team----------------
  
  exports.updateTeam = async (req, res) => {
    const { id } = req.params;
  
    const { teamID, teamName, teamLeadID } = req.body;
  
    newTeamUpdate = {
      teamID,
      teamName,
      teamLeadID,
    };
    const existingTeam = await teamSchema.findById(id);
    if (existingTeam) {
      await teamSchema
        .findByIdAndUpdate(existingTeam._id, newTeamUpdate, { new: true })
        .then(() => {
          res.json("team is updated successfully!");
        })
        .catch((err) => {
          res.status(400).json({ message: "team is not updated!" });
        });
    }
  };
  //--------------------------------------------
  
  //-------View Team-----------------------------
  
  exports.viewTeam = async (req, res) => {
    await teamSchema
      .find()
      .then((team) => {
        res.json(team);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //------------------------------------------