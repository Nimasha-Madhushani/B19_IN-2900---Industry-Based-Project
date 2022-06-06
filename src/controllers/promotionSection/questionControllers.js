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

    console.log("1");

    const { QuestionID, QuestionCatogory, QuestionBody } = req.body;
    console.log("****req.body*****");
    console.log(req.body);
    const newQuestion = new Question({ QuestionID, QuestionCatogory, QuestionBody });

    const duplicateQuestionID = await Question.findOne({ QuestionID });
    if (duplicateQuestionID) {
        return res.status(400).json({ message: "QuestionID already exists" });
    }
    console.log(duplicateQuestionID);
    await newQuestion.save().then(() => {
        res.json("New Question created");
        console.log("******newQuestion******");
        console.log("newQuestion");
    }).catch((err) => {
        res.status(400).json({ message: "Question not created", error: err.message });
    })
}



