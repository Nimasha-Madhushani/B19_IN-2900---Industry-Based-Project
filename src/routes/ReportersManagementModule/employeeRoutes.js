const router = require("express").Router();
const userRoles = require("../../Config/UserRoles");
const {
  createEmployee,
  viewEmployees,
  getEmployees,
  filterEmployee,
  updateEmployeeProfile,
  getallEmployees,
  getUser,
  getEmployeesForJobRoles,
  candidatesWithoutProfile,
  countEmployees,
} = require("../../controllers/ReportersSection/employeeControllers");

const {
  addTeam,
  viewTeam,
  updateTeam,
  getTeam,
} = require("../../controllers/ReportersSection/teamControllers");

const {
  addProduct,
  updateProduct,
  viewProducts,
} = require("../../controllers/ReportersSection/productConotrollers");

const {
  recentSection,
} = require("../../controllers/ReportersSection/recentSectionController");

const {
  displayLastSeen,
} = require("../../controllers/ReportersSection/lastSeenController");
const {
  createOragnizationStructure,
  updateOragnizationStructure,
  getOrganizationStructure,
  getLevels,
} = require("../../controllers/ReportersSection/organizationStructureContollers");

const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");

// //----------------employee controller------------------------------------------

// router.get("/count", verifyRoles([userRoles.HR]), countEmployees);

// router.get("/user/:id", verify, getUser);

// router.get("/organization", getEmployeesForJobRoles);

// router.get("/organizationStructure", getOrganizationStructure);

// router.get(
//   "/candidateData",
//   verifyRoles([userRoles.HR]),
//   candidatesWithoutProfile
// );

// router.get("/", viewEmployees);

// router.get("/getall", getallEmployees);

// router.get("/get", getEmployees);

// router.post("/add", verifyRoles([userRoles.HR]), createEmployee);

// router.put("/update/:id", verify, updateEmployeeProfile); //update own profile(NIC disable)

// router.put("/update/employee/:id", updateEmployeeProfile); //only HR can access

// //----------------------teamController------------------------------------------

// router.get("/viewTeam", viewTeam);

// router.get("/getTeam", getTeam);

// router.post("/teamAdd", verifyRoles([userRoles.HR]), addTeam);

// router.put(
//   "/updateTeam/:id",
//   verifyRoles([userRoles.HR, userRoles.TeamLeader]),
//   updateTeam
// );

// //------------------------productController---------------------------------------

// router.post("/addProduct", verifyRoles([userRoles.HR]), addProduct);

// router.put("/updateProduct/:id", verifyRoles([userRoles.HR]), updateProduct);

// router.get("/viewProducts", viewProducts);

// //--------recent section--------------------------------------------------------

// router.get("/recentSection", recentSection);

// //----------last seen----------------------------------------------------------

// router.get("/lastSeen", displayLastSeen);

// //----------organization strucutre----------------------------------------------

// router.post("/organization/create", createOragnizationStructure);

// router.put("/updateOrganization/:id", updateOragnizationStructure);

// router.get("/levels", getOrganizationStructure);

// router.get("/getLevels", getLevels);






//----------------employee controller------------------------------------------

router.get("/count",countEmployees)

router.get("/user/:id", getUser);

router.get("/organization", getEmployeesForJobRoles);

router.get("/organizationStructure", getOrganizationStructure);

router.get("/candidateData", candidatesWithoutProfile);

router.get("/", viewEmployees);

router.get("/getall", getallEmployees);

router.get("/get", getEmployees);

router.post("/add", createEmployee);

router.put("/update/:id", updateEmployeeProfile); //update own profile(NIC disable)

router.put("/update/employee/:id", updateEmployeeProfile); //only HR can access

//----------------------teamController------------------------------------------

router.get("/viewTeam", viewTeam);

router.get("/getTeam", getTeam);

router.post("/teamAdd", addTeam);

router.put("/updateTeam/:id", updateTeam);

//------------------------productController---------------------------------------

router.post("/addProduct", addProduct);

router.put("/updateProduct/:id", updateProduct);

router.get("/viewProducts", viewProducts);

//--------recent section--------------------------------------------------------

router.get("/recentSection", recentSection);

//----------last seen----------------------------------------------------------

router.get("/lastSeen", displayLastSeen);

//----------organization strucutre----------------------------------------------

router.post("/organization/create", createOragnizationStructure);

router.put("/updateOrganization/:id", updateOragnizationStructure);

router.get("/levels",getOrganizationStructure)

router.get("/getLevels",getLevels)

module.exports = router;
