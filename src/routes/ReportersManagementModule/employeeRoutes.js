const router = require("express").Router();
const {
createEmployee,addProduct, addTeam, viewEmployees, viewTeam, updateEmployeeProfile, updateProduct, updateTeam
} = require("../../controllers/ReportersSection/employeeControllers");

//view all employees
router.get('/',viewEmployees);

//create employee
router.post('/add', createEmployee);

//employee profile update including academic/proffesional qualifications
router.put('/update/:id',updateEmployeeProfile);

//view all teams
router.get('/viewTeam',viewTeam);

//add team
router.post('/teamAdd',addTeam);

//update team
router.put('/updateTeam/:id',updateTeam);

//add product
router.post('/addProduct',addProduct);

//update product
router.post('/updateProduct/:id',updateProduct);




module.exports = router;
