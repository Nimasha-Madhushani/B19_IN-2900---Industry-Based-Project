const EmployeeModel = require("../../models/ReportersManagementModule/EmployeeModel");
const organizationStructureSchema = require("../../models/ReportersManagementModule/OrganizationStructureModel");
exports.createOragnizationStructure = async (req, res) => {
  const { level, jobRole } = req.body;
  console.log(jobRole)
  console.log(level)
  try {
    const filterLevel = await organizationStructureSchema.findOne({
      level: level,
    });
    if (!filterLevel) {
      const newLevel = new organizationStructureSchema({
        level,
        jobRole,
      });
      const saveLevel = await newLevel.save();
      return res
        .status(200)
        .json({ success: true, message: "Level Created Successfully" });
    } else {
      return res.status(400).json({
        success: false,
        message: "Newly entered level is already existing",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Level is not created",
      error: err.message,
    });
  }
};

exports.updateOragnizationStructure = async (req, res) => {
  const { id } = req.params;
  const { jobRole } = req.body;
  try {
    const findLevel = await organizationStructureSchema.findOne({ _id: id });
    // const updatedLevel = { jobRole };

    if (!findLevel) {
      return res
        .status(400)
        .json({ success: false, message: "Level is not existing" });
    }
    await organizationStructureSchema.findByIdAndUpdate(
      findLevel._id,
      { $set: { jobRole: jobRole } },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Level is updated  successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Level is not updated",
      error: err.message,
    });
  }
};

exports.getOrganizationStructure = async (req, res) => {
  try {
    const findLevels = await organizationStructureSchema.find();
    let levels = [];
    findLevels.map(async (level) => {
     // console.log(level);
      let allEmployees = [];
      level.jobRole.map(async (job) => {
        const filterEmployees = await EmployeeModel.find();
        filterEmployees.map((employee) => {
          if (employee.jobRole === job) {
            allEmployees.push(employee);
          }
        });
        console.log(allEmployees)
        // allEmployees.push({
        //  filterEmployees
        // });
      });

      levels.push({ level: level, employees: allEmployees });
    });
    res.status(200).json({ state: true, levels: levels });
  } catch (err) {
    res.status(400).json({ state: false, err: err });
  }

  // exports.getOrganizationStructure = async (req, res) => {
  //   try {
  //     const findLevels = await organizationStructureSchema.find();
  //     let level = [];
  //     findLevels.map((levels) => {
  //       let allEmployees = [];
  //       levels.jobRole.map(async (job) => {
  //         // console.log(await EmployeeModel.find({ jobRole: job }))
  //         allEmployees.push({
  //           employees: await EmployeeModel.find({ jobRole: job }),
  //         });
  //         console.log(allEmployees);
  //       });

  //       level.push({ level: levels, employees: allEmployees });
  //     });
  //     res.status(200).json({ state: true, levels: level });
  //   } catch (err) {
  //     res.status(400).json({ state: false, err: err });
  //   }

  // .then((levels) => {
  //   res.status(200).json({ state: true, levels: levels });
  // })
  // .catch((err) => {
  //   res.status(400).json({ state: false, err: err });
  // });
};

// exports.getLevels = async (req, res) => {

//   await organizationStructureSchema
//     .find()
//     .then((levels) => {
     
//       res.status(200).json({ state: true, data: levels });
//     })
//     .catch((err) => {
//       res.status(400).json({ state: false, err: err });
//     });
// };

exports.getLevels = async (req, res) => {
  await organizationStructureSchema
    .find()
    .then((levels) => {
      res.status(200).json({ state: true, data: levels });
    })
    .catch((err) => {
      res.status(400).json({ state: false, err: err });
    });
};