const router = require("express").Router();

const {
  createEmployee,
  viewEmployees,
  getEmployees,
  filterEmployee,
  updateEmployeeProfile,
  getallEmployees,
  getUser,
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

//----------------employee controller------------------------------------------

// router.get("/filterEmployee/:empId",filterEmployee)
router.get("/user/:id",getUser)

router.get("/", viewEmployees);

router.get("/getall",getallEmployees)

router.get("/get",getEmployees)

router.post("/add", createEmployee);

router.put("/update/:id", updateEmployeeProfile); //update own profile(NIC disable)

router.put("/update/employee/:id", updateEmployeeProfile); //only HR can access

//----------------------teamController------------------------------------------

router.get("/viewTeam", viewTeam);

router.get("/getTeam",getTeam)

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

module.exports = router;
