const Question = require("../../models/PromotionModule/Question");

//view all questions
exports.viewAllQuestions = async (req, res) => {
    try {
        const questionList = await Question.find();
        if (questionList == null) {
            return res.status(404).json({ message: "Question list not found" });
        }
        return res.status(200).json(questionList);
    } catch (error) {
        return res.status(400).json({ message: "Error", error: error.message });
    }
}


//create Questions
exports.createQuestions = async (req, res) => {

    const { QuestionID, QuestionCatogory, QuestionBody } = req.body;

    const newQuestion = new Question({ QuestionID, QuestionCatogory, QuestionBody });

    const duplicateQuestionID = await Question.findOne({ QuestionID });
    if (duplicateQuestionID) {
        return res.status(400).json({ message: "QuestionID already exists" });
    }

    await newQuestion.save().then(() => {
        return res.json({ message: "New Question created", success: true });

    }).catch((err) => {
        res.status(400).json({ message: "Question not created", error: err.message, success: false });
    })
}



