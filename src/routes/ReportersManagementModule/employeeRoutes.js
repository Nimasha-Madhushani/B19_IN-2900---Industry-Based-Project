const router = require("express").Router();
const {
createEmployee, addAcademicQualification,addProffesionalQualification,addProduct, addTeam, viewEmployees, viewTeam, updateEmployeeProfile
} = require("../../controllers/ReportersSection/employeeControllers");

//view all employees
router.get('/',viewEmployees);

//view all teams
router.get('/viewTeam',viewTeam);

//create employee
router.post('/add', createEmployee);

//add employee profile update
router.put('/update/:id',updateEmployeeProfile);

//add proffesional qualifications
router.post('/proffesionalAdd',addProffesionalQualification);

//add team
router.post('/teamAdd',addTeam);

//add product
router.post('/productAdd',addProduct);



module.exports = router;
