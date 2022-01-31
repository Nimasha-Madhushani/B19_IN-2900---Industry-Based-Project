const mongoose = require("mongoose");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
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

//-------View all Teams-----------------------------

exports.viewTeam = async (req, res) => {
  await teamSchema
    .find()
    .then((team) => {
      res.json({ state: true, data: team });
    })
    .catch((err) => {
      res.json({ state: false, err: err });
    });
};

//------------------------------------------

//------------create organization structure---------------------------------
exports.viewOrgStructure = async (req, res) => {
  const { id } = req.params;

  const teamList = await teamSchema.find(id);

  const levelOne = [],
    levelTwo = [],
    levelThree = [];

  if (teamList) {
    for (let index = 0; index < teamList.length; index++) {
      const job = await employeeSchema.find({
        jobRole: teamList[index].jobRole,
      });
      if (job === " CEO ") {
        levelOne.push({ jobRole: teamList[index].jobRole, job: job });
        //res.json(levelOne);
      } else if (job === "SE" || job === "SSA ") {
        levelTwo.push({ jobRole: teamList[index].jobRole, job: job });
        //res.json(levelTwo);
      } else {
        levelThree.push({ jobRole: teamList[index].jobRole, job: job });
        res.json(levelThree);

        if (!job) {
          //res.json("Employee not found");
        }
      }
    }
    res.status(201).json(levelOne, levelTwo, levelThree);
  }
};
