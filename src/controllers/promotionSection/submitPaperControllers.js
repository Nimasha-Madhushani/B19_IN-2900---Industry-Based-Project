//controller for giving employee ratings on a given paper

const Paper = require("../../models/PromotionModule/Paper");
const AnsweredQuestionPaper = require("../../models/PromotionModule/AnsweredQuestionPaper");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const Question = require("../../models/PromotionModule/Question");
const Exam = require("../../models/PromotionModule/Exam");


//display relevent paper to the employee
exports.displayPaper = async (req, res) => {
    const eid = req.params.EmployeeID;

    try {
        const emp = await employeeSchema.findOne({ employeeID: eid });
        const empJobRole = emp.jobRole;

        const examScheduled = await Exam.findOne({ JobRole: empJobRole, Status: "Pending" })
        // console.log("examScheduled", examScheduled);

        const paper = await Paper.findOne({ PaperID: examScheduled.PaperID });
        // console.log("paper", paper);

        const questions = [];
        const fullDetailedPaper = [];

        for (let i = 0; i < paper.Questions.length; i++) {
            questions.push(await Question.findOne({ QuestionID: paper.Questions[i] }));
        }

        const { PaperID, PaperName, PaperType, DateCreated } = paper;
        const fullPaper = {
            PaperID, PaperName, PaperType, DateCreated,
            questions: questions
        }
        fullDetailedPaper.push(fullPaper);
        if (paper == null) {
            return res.status(404).json({ message: "Paper not found", error: err.message })
        }
        return res.status(200).json(fullDetailedPaper);
    } catch (err) {
        // console.log("error")
        return res.status(404).json({ message: "Paper not found", error: err.message, success: false })
    }
};

//Submit paper
exports.submitPaper = async (req, res) => {
    try {
        const eid = req.params.EmployeeID;
        // console.log("1");

        const DateAttempted = new Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' });

        const { PaperID, Questions } = req.body;
        // console.log(req.body);
        // console.log("2");

        const FoundEmployee = await employeeSchema.findOne({ employeeID: eid })
        if (FoundEmployee == null) {
            return res.status(500).send({ message: "Employee not found" });
        }
        // console.log("3");

        // const FoundPaper = await Paper.findOne({ PaperID: PaperID })
        // if (FoundPaper == null) {
        //     return res.status(500).send({ message: "Paper not found" });
        // }

        // console.log("4");
        const newAttempt = new AnsweredQuestionPaper({ PaperID, EmployeeID: eid, DateAttempted, Questions });
        // console.log("newAttempt", newAttempt);
        await newAttempt.save();
        if (!newAttempt) {
            return res.status(404).json({ message: "Answers not submitted successfully." });
        }
        // console.log("from new attempt", newAttempt);
        return res.status(201).json({ message: "Answers submitted successfully.", success: true });

    } catch (err) {
        return res.status(404).json({ message: "Answers not submitted successfully.", err: err.message });
    }
}






