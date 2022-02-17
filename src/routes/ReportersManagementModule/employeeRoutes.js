const router = require("express").Router();

const {
  createEmployee,
  viewEmployees,
  updateEmployeeProfile,
  loginEmployee,
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

//----------------employee controller------------------------------------------

router.get("/", viewEmployees);

router.post("/add", createEmployee);

router.post("/login/",loginEmployee);

router.put("/update/:id", updateEmployeeProfile);

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

module.exports = router;
