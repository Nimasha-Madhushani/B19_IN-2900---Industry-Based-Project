const AnsweredQuestionPaper = require("../../models/PromotionModule/AnsweredQuestionPaper");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const teams = require("../../models/ReportersManagementModule/TeamModel");
const Question = require("../../models/PromotionModule/Question");
const Exam = require("../../models/PromotionModule/Exam");

//view all submissions
exports.allSubmissions = async (req, res) => {
    try {
        const allSubmitions = await AnsweredQuestionPaper.find();
        const allPapers = [];

        for (let i = 0; i < allSubmitions.length; i++) {

            const { PaperID, EmployeeID, DateAttempted, TeamLeadID, Feedback, DateOfEvaluation } = allSubmitions[i];
            const oneSubmitted = { PaperID, EmployeeID, DateAttempted, TeamLeadID, Feedback, DateOfEvaluation };
            allPapers.push(oneSubmitted);
        }
        if (!allPapers) {
            return res.status(404).send({ message: "submitted paper list has not fetch successfully" })
        }
        // res.status(200).json({ message: "Submitted paper list has fetch successfully", paperList: allPapers })

        res.status(200).json(allPapers);
    } catch (error) {
        res.status(404).json({ message: "Submitted paper list has not fetch successfully", error: error.message })
    }
}


//display teamleads team member submissions only
exports.displayTeamMemberSubmissions = async (req, res) => {
    try {

        //getting team lead's team id
        const teamLeadId = req.params.TeamLeadID;

        const FoundTl = await teams.findOne({ teamLeadID: teamLeadId })
        if (FoundTl == null) {
            return res.status(400).send({ message: "Team Lead ID not found" });
        }

        const team = await teams.findOne({ teamLeadID: teamLeadId })
        let teamLeadsTeamId = team._id;

        //getting team's employees
        let employeesArray = await employeeSchema.find({ teamID: teamLeadsTeamId });

        const allPapers = [];

        for (let i = 0; i < employeesArray.length; i++) {

            const paper = await AnsweredQuestionPaper.find({ EmployeeID: employeesArray[i].employeeID });


            for (let j = 0; j < paper.length; j++) {
                const { PaperID, EmployeeID, DateAttempted, TeamLeadID, Feedback, DateOfEvaluation } = paper[j];
                const paperOfEmployee = { PaperID, EmployeeID, DateAttempted, TeamLeadID, Feedback, DateOfEvaluation };
                allPapers.push(paperOfEmployee);
            }
        }

        if (allPapers == null) {
            return res.status(404).json({ message: "submitted paper list under Team Lead has not fetch successfully" })
        }
        // res.status(200).json({ message: "Submitted paper list under Team Lead has fetch successfully", paperList: allPapers })
        res.status(200).json(allPapers);

    } catch (error) {
        res.status(404).json({ message: "Submitted paper list under Team Lead has not fetch successfully", error: error.message })
    }
}



//evaluate a paper 
exports.evaluatePaper = async (req, res) => {
    console.log("eval executed");
    const tlID = req.params.TeamLeadID;
    const feedback = req.body.Feedback['Feedback'];
    const pID = req.params.PaperID;
    const eid = req.params.EmployeeID;
    const doe = new Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' });
    // console.log("here pID: ", pID);
    // console.log("here eid: ", eid);
    // console.log("here doe: ", doe);
    // console.log("here tlID", tlID);
    // console.log("feed", feedback);

    try {
        let teamLeadRatings = [];
        let updateQuestion = [];
        console.log("hhhh");
        teamLeadRatings = req.body.Questions;
        console.log("here body", req.body);
        console.log("here teamLeadRatings", req.body.Questions);
        if (teamLeadRatings == null) {
            console.log("here teamLeadRatings null");
            return res.status(404).send({ message: "empty teamLeadRatings" })
        }

        if (teamLeadRatings) {
            const answeredQuestions = await AnsweredQuestionPaper.findOne({ EmployeeID: eid, PaperID: pID });
            if (!answeredQuestions) {
                return res.status(400).send({ message: "Answered Sheet not found" });
            }
            for (let i = 0; i < teamLeadRatings.length; i++) {
                let question = [];
                for (let j = 0; j < answeredQuestions.Questions.length; j++) {
                    if (teamLeadRatings[i].QuestionID == answeredQuestions.Questions[j].QuestionID) {
                        question = {
                            QuestionID: answeredQuestions.Questions[j].QuestionID,
                            EmployeeRating: answeredQuestions.Questions[j].EmployeeRating,
                            TeamLeadRating: teamLeadRatings[i].TeamLeadRating
                        }
                    }
                }
                updateQuestion.push(question)
            }
        }
        const updatedPaper = await AnsweredQuestionPaper.findOneAndUpdate({ PaperID: pID, EmployeeID: eid }, {
            TeamLeadID: tlID,
            Feedback: feedback,
            DateOfEvaluation: doe,
            $set: { Questions: updateQuestion }
        });
        if (updatedPaper == null) {
            return res.status(400).send({ message: "Team Lead ratings have not added" });
        }
        console.log(updatedPaper);
        console.log("Team Lead ratings have added successfully")
        return res.status(201).json({ message: "Team Lead ratings have added successfully" });
    } catch (err) {
        return res.status(404).json({ message: "Team Lead ratings have not added", err: err.message });
    }
}



//display each employee , his submissions and evaluation feedback
exports.displayFeedback = async (req, res) => {
    try {

        const eid = req.params.EmployeeID;

        const Foundeid = await employeeSchema.findOne({ employeeID: eid })
        if (Foundeid == null) {
            return res.status(400).send({ message: "Employee ID not found" });
        }

        const employeeSubmitions = await AnsweredQuestionPaper.find({ EmployeeID: eid });
        if (employeeSubmitions.length < 1) {
            return res.status(400).send({ message: "You have not submitted any paper yet" });
        }

        const allPaperSubmissions = [];

        for (let i = 0; i < employeeSubmitions.length; i++) {

            const { PaperID, EmployeeID, DateAttempted, TeamLeadID, Feedback, DateOfEvaluation } = employeeSubmitions[i];
            const submition = { PaperID, EmployeeID, DateAttempted, TeamLeadID, Feedback, DateOfEvaluation };
            allPaperSubmissions.push(submition);
        }

        if (allPaperSubmissions.length == null) {
            return res.status(404).send({ message: "Submitted papers by employee has not fetched successfully" })
        }

        res.status(200).json(allPaperSubmissions);

    } catch (error) {
        res.status(404).json({ message: "Submitted papers by employee has not fetched successfully", error: error.message })
    }
}


exports.displayAnsweredPaperToTeamlead = async (req, res) => {
    //evaluation/allSubmissions/displayOne/:TeamLeadID/:EmployeeID/:PaperID
    console.log("display answered paper");
    try {
        // const teamLeadId = req.params.TeamLeadID;
        const eid = req.params.EmployeeID;
        const pID = req.params.PaperID;

        const PaperAnswered = await AnsweredQuestionPaper.findOne({ EmployeeID: eid, PaperID: pID });
        console.log("PaperAnswered", PaperAnswered);


        if (PaperAnswered == null) {
            return res.status(400).json({ message: "Paper Answered not found" });
        }
        // return res.status(200).json(Array(PaperAnswered));
        return res.status(200).json(Array(PaperAnswered));
    } catch (error) {
        res.status(404).json({ message: "Error", error: error.message })
    }
}

