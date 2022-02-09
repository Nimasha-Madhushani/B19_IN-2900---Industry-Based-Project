const mongoose = require("mongoose");
const {
  find,
  findOne,
} = require("../../models/ReportersManagementModule/EmployeeModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");

//---------------create team-------------------

exports.addTeam = async (req, res) => {
  const { teamName, teamLeadID, teamMembers } = req.body; //?teamMembers

  const newTeam = new teamSchema({
    teamName,
    teamLeadID,
  });
  console.log(teamMembers);
  try {
    const existingTeam = await teamSchema.findOne({ teamName: teamName });

    if (existingTeam) {
      return res.status(400).json({ message: "This Team Name already exists" });
    }

    //front end
    /*
  const existingEmp = await employeeSchema.findOne({ employeeID: teamLeadID });
  if (!existingEmp) {
    return res.status(200).json({ message: "TeamLead is not existing" });
  }*/
    const existingTeamLead = await teamSchema.findOne({
      teamLeadID: teamLeadID,
    });
    const temLdMember = await employeeSchema.findOne({
      employeeID: teamLeadID,
    });

    if (existingTeamLead) {
      return res
        .status(400)
        .json({ message: "Team lead has already belongs to a team" });
    }
    if (temLdMember.teamID) {
      return res
        .status(400)
        .json({ message: "Team lead is already a member of team" });
    }

    let memberFlag = false;
    if (teamMembers) {
      await Promise.all(
        teamMembers.map(async (member) => {
          const existingEmp = await employeeSchema.findOne({
            employeeID: member,
          });

          if (existingEmp.teamID || !existingEmp) {
            return (memberFlag = true);
          }
        })
      );
    }
    if (memberFlag) {
      return res.status(400).json({ message: "Team cannot be created!" });
    }
    const savedTeam = await newTeam.save();

    //update teamLead profile
    const teamLeadUpdate = await employeeSchema.findOneAndUpdate(
      { employeeID: teamLeadID },
      { $set: { teamID: savedTeam._id } } //?
    );
    console.log(teamMembers);

    let updateEmployeeCount = 0;
    if (teamMembers) {
      updateEmployeeCount = teamMembers.length; //?

      await Promise.all(
        teamMembers.map(async (member) => {
          const existingEmp = await employeeSchema.findOne({
            employeeID: member,
          });

          console.log(existingEmp);

          if (!existingEmp.teamID) {
            await employeeSchema.findOneAndUpdate(
              { employeeID: member },
              { $set: { teamID: savedTeam._id } } //?
            );
            updateEmployeeCount--;
          } else {
            return res
              .status(400)
              .json({ message: "member already belongs to a team" });
          }
        })
      );
    }
    if (savedTeam && !updateEmployeeCount && teamLeadUpdate) {
      return res
        .status(200)
        .json({ message: "Team added successfully and employee updated" });
    }

    res.status(200).json({ message: "Team is  added!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-----------------------------------------

//--------------update team----------------

exports.updateTeam = async (req, res) => {
  const { id } = req.params;

  const { teamMembers, teamName, teamLeadID } = req.body;

  try {
    const newTeamUpdate = {
      teamName,
      teamLeadID,
    };
    const existingTeamLdEmp = await employeeSchema.findOne({
      employeeID: teamLeadID,
    });
    const team = await teamSchema.findOne({ _id: id });

    if (existingTeamLdEmp.teamID && existingTeamLdEmp.teamID != id) {
      return res.status(401).json("This member already belongs to a team");
    }
    for (let index = 0; index < teamMembers.length; index++) {
      const member = await employeeSchema.findOne({
        employeeID: teamMembers[index],
      });
      if (member.teamID && member.teamID != id) {
        console.log("log 1");
        return res
          .status(401)
          .json(
            "This member " + teamMembers[index] + " already belongs to a team"
          );
      }
    }

    if (team && existingTeamLdEmp) {
      const filterTeams = await teamSchema.find({ _id: { $ne: id } });
      //console.log(filterTeams);
      let chekFalg = false;
      await Promise.all(
        filterTeams.map(async (filtervalue) => {
          if (
            filtervalue.teamName == teamName ||
            filtervalue.teamLeadID == teamLeadID
          ) {
            chekFalg = true;
          }
        })
      );

      const oldTeamLead = await employeeSchema.findOne({
        employeeID: team.teamLeadID,
      });

      const oldMembers = await employeeSchema.find({
        teamID: id,
        employeeID: { $ne: oldTeamLead.employeeID },
      });

      // update team
      const duplicateTeamLd = await teamSchema.findOne({
        teamLeadID: teamLeadID,
      });
      //console.log(chekFalg);
      if (!chekFalg) {
        await teamSchema.findByIdAndUpdate(id, newTeamUpdate, {
          new: true,
        });

        // update old team members profile : remove their Team ID
        await Promise.all(
          oldMembers.map(async (oldmember) => {
            await Promise.all(
              teamMembers.map(async (teammember) => {
                if (oldmember.employeeID != teammember) {
                  await employeeSchema.findOneAndUpdate(
                    { employeeID: oldmember.employeeID },
                    { $set: { teamID: "" } }
                  );
                }
              })
            );
          })
        );
        // update new team members profile
        await Promise.all(
          teamMembers.map(async (teammember) => {
            await employeeSchema.findOneAndUpdate(
              { employeeID: teammember },
              { $set: { teamID: id } }
            );
          })
        );
        if (teamLeadID != team.teamLeadID) {
          // updateOldTeamLead

          await employeeSchema.findOneAndUpdate(
            { employeeID: oldTeamLead.employeeID },
            { $set: { teamID: "" } }
          );

          // updateNewTeamLead
          await employeeSchema.findOneAndUpdate(
            { employeeID: teamLeadID },
            { $set: { teamID: id } }
          );
        }

        res
          .status(201)
          .json({ message: "Team and employee have updated successfully" });
      } else {
        res.json("cannot update");
      }
    } else {
      res.json("mkemkcfkrf"); //?
    }
  } catch (error) {
    res.status(404).json({
      message: "Team and employee have not updated",
      error: error.message,
    });
  }
};
//-------View all Teams-----------------------

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
