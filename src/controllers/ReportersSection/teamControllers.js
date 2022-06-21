const mongoose = require("mongoose");
const {
  find,
  findOne,
} = require("../../models/ReportersManagementModule/EmployeeModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");

//---------------create team-------------------

exports.addTeam = async (req, res) => {
  const { teamName, teamLeadID, teamMembers } = req.body;
  // console.log(req.body);
  const newTeam = new teamSchema({
    teamName,
    teamLeadID,
  });

  try {
    const existingTeam = await teamSchema.findOne({ teamName: teamName });

    if (existingTeam) {
      return res
        .status(400)
        .json({ status: "This Team Name already exists", success: false });
    }

    
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
      { $set: { teamID: savedTeam._id } } 
    );

    

    let updateEmployeeCount = 0;
    if (teamMembers) {
      updateEmployeeCount = teamMembers.length; 

      await Promise.all(
        teamMembers.map(async (member) => {
          const existingEmp = await employeeSchema.findOne({
            employeeID: member,
          });

          if (!existingEmp.teamID) {
            await employeeSchema.findOneAndUpdate(
              { employeeID: member },
              { $set: { teamID: savedTeam._id } } 
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
        .json({
          status: "Team added successfully and employee updated",
          success: true,
        });
    }

    res.status(200).json({ status: "Team is  added!", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
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
        return res
          .status(401)
          .json(
            "This member " + teamMembers[index] + " already belongs to a team"
          );
      }
    }

    if (team && existingTeamLdEmp) {
      const filterTeams = await teamSchema.find({ _id: { $ne: id } });
      
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
        // update new team members profile
        await Promise.all(
          teamMembers.map(async (teammember) => {
            await employeeSchema.findOneAndUpdate(
              { employeeID: teammember },
              { $set: { teamID: id } }
            );
          })
        );

        res
          .status(201)
          .json({ message: "Team and employee have updated successfully",success:true });
      } else {
        res.json({message:"cannot update",success:false});
      }
    } else {
      res.json("team is not updated");
    }
  } catch (error) {
    res.status(404).json({
      message: "Team and employee have not updated",
      error: error.message,
    });
  }
};
//-------View all Teams-----------------------

exports.getTeam = async (req, res) => {
  await teamSchema
    .find()
    .then((team) => {
      res.json({ state: true, data: team });
    })
    .catch((err) => {
      res.json({ state: false, err: err });
    });
};

//view all team details

exports.viewTeam = async (req, res) => {
  try {
    const newCollection = await teamSchema.aggregate([
      {
        $addFields: {
          _id: { $toString: "$_id" }, //converts the ObjectId of teams collecton to string
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id", // field in the employee collection
          foreignField: "teamID", // field in the team collection
          as: "TeamWithEmp",
        },
      },
      {
        $addFields: {
          _id: { $toString: "$_id" }, //converts the ObjectId of teams collecton to string
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id", // field in the product collection
          foreignField: "teamID", // field in the team collection
          as: "ProductOfTeam",
        },
      },
    ]);
    res.status(200).json({ data: newCollection });
  } catch (err) {
    return res.status(404).json({ err: err.message });
  }
};
