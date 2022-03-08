const router = require("express").Router();

const {
  createEmployee,
  viewEmployees,
  updateEmployeeProfile,
} = require("../../controllers/ReportersSection/employeeControllers");

const {
  addTeam,
  viewTeam,
  updateTeam,
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

router.get("/", viewEmployees);

router.post("/add", createEmployee);

router.put("/update/:id", updateEmployeeProfile);//update own profile(NIC disable)

router.put("/update/employee/:id",  updateEmployeeProfile);//only HR can access

//----------------------teamController------------------------------------------

router.get("/viewTeam", viewTeam);

router.post("/teamAdd", addTeam);

router.put("/updateTeam/:id", updateTeam);

//------------------------productController---------------------------------------

router.post("/addProduct", addProduct);

router.post("/updateProduct/:id", updateProduct);

router.get("/viewProducts", viewProducts);

//--------recent section--------------------------------------------------------

router.get("/recentSection", recentSection);

//----------last seen----------------------------------------------------------

router.get("/lastSeen", displayLastSeen);

module.exports = router;
