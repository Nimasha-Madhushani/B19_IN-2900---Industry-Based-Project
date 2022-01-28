const router = require("express").Router();
const {
createEmployee, addAcademicQualification,addProffesionalQualification,addProduct, addTeam, viewEmployees
} = require("../../controllers/ReportersSection/employeeControllers");

//view all aemployees
router.get('/',viewEmployees);

//create employee
router.post('/add', createEmployee);

//add academic qualifications
router.post('/academicAdd',addAcademicQualification);

//add proffesional qualifications
router.post('/proffesionalAdd',addProffesionalQualification);

//add team
router.post('/teamAdd',addTeam);

//add product
router.post('/productAdd',addProduct);



module.exports = router;
