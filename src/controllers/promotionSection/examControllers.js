const Exam = require("../../models/PromotionModule/Exam");

//controller for HR to schedule exams
exports.scheduleExam = async (req, res) => {

    const DateCreated = new Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' });

    try {
        const eid = req.params.EmployeeID;
        const { ExamID, ExamName, DateScheduled, JobRole, PaperID } = req.body;
        //const Date = DateScheduled.toLocaleString('IST', { timeZone: 'Asia/Kolkata' });

        const newExam = new Exam({ organizerID: eid, ExamID, ExamName, DateCreated, DateScheduled, PaperID, JobRole });
        console.log(DateScheduled);
        await newExam.save();
        if (!newExam) {
            return res.status(400).json({ message: "New Exam not created.", success: false });
        }
        return res.status(200).json({ message: "successfully created new Exam.", success: true });
    } catch (error) {
        return res.status(400).json({ error: error.message, success: false })
    }
}

// //delete scheduled exam
exports.deleteScheduledExam = async (req, res) => {
    const examId = req.params.ExamID;
    try {
        const deleteExam = await Exam.findOneAndDelete({ ExamID: examId });
        if (!deleteExam) {
            return res.status(400).json({ message: "Scheduled exam not found", error: error.message, success: false });
        }
        return res.status(200).json({ message: "Scheduled exam has deleted successfully", success: true });
    }
    catch (error) {
        return res.status(404).json({ message: "Scheduled exam not deleted", error: error.message, success: false });
    }
}


//update scheduled exam
exports.updateExamDetails = async (req, res) => {
    const examId = req.params.ExamID;
    try {
        const { ExamName, DateScheduled, JobRole, PaperID } = req.body;

        let exam = await Exam.findOneAndUpdate({ ExamID: examId }, {
            ExamID: examId, ExamName: ExamName, DateScheduled: DateScheduled, JobRole: JobRole, PaperID: PaperID
        });
        if (!exam) {
            return res.status(404).json({ message: "not found exam", success: false, error: error.message });
        }
        return res.status(200).json({ message: "updated exam", success: true });

    } catch (error) {
        return res.status(404).json({ success: false, error: error.message });
    }
}

//viewScheduled exmas
exports.viewAllExams = async (req, res) => {
    try {
        const examList = await Exam.find();
        if (!examList) {
            return res.status(404).json({ message: "Exam list not found", error: error.message, success: false });
        }
        return res.status(200).json(examList);
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error.message });
    }
}

//view one exam details
exports.viewOneExam = async (req, res) => {
    const examId = req.params.ExamID;
    try {
        const examFound = await Exam.findOne({ ExamID: examId });
        if (!examFound) {
            return res.status(404).json({ message: "Exam not found", error: error.message, success: false });
        }
        return res.status(200).json(examFound);
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error.message });
    }
}
