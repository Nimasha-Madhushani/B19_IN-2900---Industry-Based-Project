const AnsweredQuestionPaper = require("../../models/PromotionModule/AnsweredQuestionPaper");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const teams = require("../../models/ReportersManagementModule/TeamModel");


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
    try {

        const tlID = req.body.TeamLeadID;
        const fb = req.body.Feedback;
        const pID = req.params.PaperID;
        const eid = req.params.EmployeeID;
        const doe = new Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' });

        const FoundTl = await teams.findOne({ teamLeadID: tlID })
        if (FoundTl == null) {
            return res.status(400).send({ message: "Team Lead ID not found" });
        }

        const Foundeid = await employeeSchema.findOne({ employeeID: eid })
        if (!Foundeid) {
            return res.status(400).send({ message: "Employee ID not found" });
        }

        let teamLeadRatings = [];
        let updateQuestion = [];
        teamLeadRatings = req.body.Questions;//QuestionID,TeamLeadRating,Feedback,TeamLeadID
        //console.log(teamLeadRatings);

        if (teamLeadRatings) {
            const answeredQuestions = await AnsweredQuestionPaper.findOne({ EmployeeID: eid, PaperID: pID });
            if (!answeredQuestions) {
                return res.status(400).send({ message: "Answered Sheet not found" });
            }
            //console.log("answeredQuestions:  " + answeredQuestions);
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
            Feedback: fb,
            DateOfEvaluation: doe,
            $set: { Questions: updateQuestion }
        });
        // console.log(updatedPaper);

        if (updatedPaper == null) {
            return res.status(400).send({ message: "Team Lead ratings have not added" });
        }
        res.status(201).json({ message: "Team Lead ratings have added successfully" });
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

        res.status(200).json({ message: "Submitted papers by employee has fetched successfully", submittedPaperList: allPaperSubmissions });

    } catch (error) {
        res.status(404).json({ message: "Submitted papers by employee has not fetched successfully", error: error.message })
    }
}
