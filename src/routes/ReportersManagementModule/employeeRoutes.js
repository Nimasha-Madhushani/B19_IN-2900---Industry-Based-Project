const router = require("express").Router();

//----------------employee controller------------------------------------------
const {
  createEmployee,
  viewEmployees,
  updateEmployeeProfile,
} = require("../../controllers/ReportersSection/employeeControllers");

//view all employees
router.get("/", viewEmployees);

//create employee
router.post("/add", createEmployee);

//employee profile update including academic/proffesional qualifications
router.put("/update/:id", updateEmployeeProfile);

//------------------------------------------------------------------------------

//----------------------teamController------------------------------------------

const {
  addTeam,
  viewTeam,
  updateTeam,
  viewOrgStructure
} = require("../../controllers/ReportersSection/teamControllers");

//view all teams
router.get("/viewTeam", viewTeam);

//add team
router.post("/teamAdd", addTeam);

//update team
router.put("/updateTeam/:id", updateTeam);

//organizationStructure
router.get("/viewOrgStructure",viewOrgStructure);

//------------------------productController---------------------------------------

const {
  addProduct,
  updateProduct,
  
} = require("../../controllers/ReportersSection/productConotrollers");

//add product
router.post("/addProduct", addProduct);

//update product
router.post("/updateProduct/:id", updateProduct);


/*
//--------recent section-----------
const{recentSection }=require("../../controllers/ReportersSection/recentSectionController")
router.get("/recentSection ",recentSection )
*/
module.exports = router;
