const express = require("express");
const router = express.Router();
// const verify = require("../../middleware/VerifyJWT");
// const verifyRoles = require("../../middleware/verifyUserRole");
// const userRoles = require("../../Config/UserRoles");


//importing controllers of question
const {
    viewAllQuestions,
    createQuestions
} = require("../../controllers/promotionSection/questionControllers");


//importing controllers of papper
const {
    viewAllPapersList,
    createPaper,
    addMoreQuestions,
    updatePaperDetails,
    deletePaper,
    viewOnePaper
} = require("../../controllers/promotionSection/paperControllers");



//importing controllers of submitting paper
const {
    submitPaper,
    displayPaper
} = require("../../controllers/promotionSection/submitPaperControllers");


//importing controllers of evaluation
const {
    allSubmissions,
    evaluatePaper,
    displayTeamMemberSubmissions,
    displayFeedback,
    displayAnsweredPaperToTeamlead
} = require("../../controllers/promotionSection/evaluationControllers")

//importing controllers for exam scheduling
const {
    scheduleExam,
    deleteScheduledExam,
    updateExamDetails,
    viewAllExams,
    viewOneExam
} = require("../../controllers/promotionSection/examControllers");
const { getEvaluationDetails, promoteEmployee, getPromotionHistory, getJobRoleStats } = require("../../controllers/promotionSection/promotionController");


// routes for the Questions
router.get('/Questions', viewAllQuestions); //view all questions
router.post('/Questions/create', createQuestions);//create new questions


// routes for the paper
router.get('/Paper', viewAllPapersList); //view all papers created
router.post('/Paper/createPaper', createPaper);//create new paper
router.patch('/Paper/addMoreQuestions/:PaperID', addMoreQuestions);
router.patch('/Paper/updatePaperDetails/:PaperID', updatePaperDetails);
router.delete('/Paper/delete/:PaperID', deletePaper);
router.get('/Paper/:EmployeeID', displayPaper);
router.get('/Paper/display/:PaperID', viewOnePaper);//view one paper with questions


//routes for promotion paper for employee
router.post('/submitPaper/:EmployeeID', submitPaper);
router.get('/evaluation/mySubmissions/:EmployeeID', displayFeedback);


//routes for evaluation by teamleads, HR and CTO
router.get('/evaluation/allSubmissions', allSubmissions);
router.get('/evaluation/allSubmissions/:TeamLeadID', displayTeamMemberSubmissions);
router.get('/evaluation/allSubmissions/displayOne/:EmployeeID/:PaperID', displayAnsweredPaperToTeamlead);
router.patch('/evaluation/evaluatePaper/:TeamLeadID/:EmployeeID/:PaperID', evaluatePaper);

//routes for scheuling exam
router.post('/evaluation/exam/scheduleExam/:EmployeeID', scheduleExam);
router.delete('/evaluation/exam/deleteExam/:EmployeeID/:ExamID', deleteScheduledExam);
router.patch('/evaluation/exam/updateExam/:EmployeeID/:ExamID', updateExamDetails);
router.get('/evaluation/exam/viewExam/:EmployeeID', viewAllExams);
router.get('/evaluation/exam/viewOneExam/:EmployeeID/:ExamID', viewOneExam);//

// routes for promotion
router.get('/evaluation/details', getEvaluationDetails)
router.post('/evaluation/promote/:id', promoteEmployee)
router.get('/history', getPromotionHistory);
router.get('/jobRole/stats', getJobRoleStats);


module.exports = router;
