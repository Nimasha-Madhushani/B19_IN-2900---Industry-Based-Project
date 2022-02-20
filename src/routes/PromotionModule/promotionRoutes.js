const express = require("express");
const router = express.Router();


//importing controllers of question
const { viewAllQuestions, createQuestions } = require("../../controllers/promotionSection/questionControllers");


//importing controllers of
const {
    viewAllPapersList,
    createPaper,
    addMoreQuestions,
    updatePaperDetails,
    deletePaper
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
    displayFeedback
} = require("../../controllers/promotionSection/evaluationControllers")



// routes for the Questions
router.get('/Questions/', viewAllQuestions); //view all questions
router.post('/Questions/create', createQuestions);//create new questions



// routes for the paper
router.get('/Paper/', viewAllPapersList); //view all papers created
router.post('/Paper/createPaper', createPaper);//create new paper
router.patch('/Paper/addMoreQuestions/:PaperID', addMoreQuestions);
router.patch('/Paper/updatePaperDetails/:PaperID', updatePaperDetails);
router.delete('/Paper/delete/:PaperID', deletePaper);
router.get('/Paper/:EmployeeID', displayPaper);





//routes for Ratings
router.post('/submitPaper/:EmployeeID', submitPaper);
router.get('/evaluation/mySubmissions/:EmployeeID', displayFeedback);

router.get('/evaluation/allSubmissions', allSubmissions);
router.get('/evaluation/allSubmissions/:TeamLeadID', displayTeamMemberSubmissions);
router.patch('/evaluation/evaluatePaper/:EmployeeID/:PaperID/', evaluatePaper);


module.exports = router;
