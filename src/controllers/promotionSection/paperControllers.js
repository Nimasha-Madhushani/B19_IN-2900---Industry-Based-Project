const Paper = require("../../models/PromotionModule/Paper");
const Question = require("../../models/PromotionModule/Question");

//view all paper list by teamleads
exports.viewAllPapersList = async (req, res) => {
    try {
        const papers = await Paper.find();
        const fullPapers = [];

        for (let index_1 = 0; index_1 < papers.length; index_1++) {

            const paperQuestions = [];

            for (let index_2 = 0; index_2 < papers[index_1].Questions.length; index_2++) {

                paperQuestions.push(await Question.findOne({ QuestionID: papers[index_1].Questions[index_2] }));
            }
            const { PaperID, PaperName, PaperType, DateCreated } = papers[index_1];
            const fullPaper = {
                PaperID, PaperName, PaperType, DateCreated,
                questions: paperQuestions
            }
            fullPapers.push(fullPaper);
            // console.log(fullPaper);
        }
        if (!fullPapers) {
            return res.status(404).json({ message: "paper list has not fetch successfully" })
        }
        // res.status(201).json({ message: "paper list has fetch successfully", paperList: fullPapers })
        res.status(201).json(fullPapers)

    } catch (error) {
        res.status(404).json({ message: "paper list has not fetch successfully", error: error.message })
    }
}


//create paper 
exports.createPaper = async (req, res) => {

    var DateCreated = new Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' });

    try {
        const { PaperID, PaperName, PaperType, Questions } = req.body;//getting paper details

        const existsPaperID = await Paper.findOne({ PaperID: PaperID });
        if (existsPaperID) {
            return res.status(404).json({ message: "Paper ID already exists" })
        }

        const existsPaperName = await Paper.findOne({ PaperName: PaperName });
        if (existsPaperName) {
            return res.status(404).json({ message: "Paper name already exists" })
        }

        const newPaper = new Paper({ PaperID, PaperName, PaperType, DateCreated, Questions });

        await newPaper.save();
        if (!newPaper) {
            return res.status(404).json({ message: "New Paper not created successfully" });
        }
        res.status(200).json({ message: "New Paper created succesfully", newPaper });

    } catch (error) {
        res.status(404).json({ message: "New Paper not created successfully", error: error.message })
    }
}


//update paper details
// exports.updatePaperDetails = async (req, res) => {
//     var pID = req.params.PaperID;
//     // console.log("pid :", pID);
//     try {
//         const filter = { PaperID: pID };
//         const update = req.body;

//         // console.log(update);
//         let doc = await Paper.findOneAndUpdate(filter, update);
//         if (!doc) {
//             return res.status(404).json({ success: false, error: error.message });
//         }
//         res.status(200).json({ success: true });

//     } catch (error) {
//         return res.status(404).json({ success: false, error: error.message });
//     }
// }
exports.updatePaperDetails = async (req, res) => {
    var pID = req.params.PaperID;
    // console.log("pid :", pID);
    try {
        // const filter = { PaperID: pID };
        //  const uPID = req.body.PaperID;
        const pName = req.body.PaperName;
        const pType = req.body.PaperType;

        // console.log(update);
        let doc = await Paper.findOneAndUpdate({ PaperID: pID }, {
            PaperName: pName,
            PaperType: pType
        });
        if (!doc) {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(200).json({ success: true });

    } catch (error) {
        return res.status(404).json({ success: false, error: error.message });
    }
}


//add more questions to the paper
exports.addMoreQuestions = async (req, res) => {
    console.log("addMoreQuestions from backend");
    const pID = req.params.PaperID;
    console.log("pID", pID);
    var dateCreated = new Date().toLocaleString('IST', { timeZone: 'Asia/Kolkata' });

    const FoundPaper = await Paper.findOne({ PaperID: pID })
    if (FoundPaper == null) {
        return res.status(500).send({ message: "Paper not found", success: false });
    }
    console.log("FoundPaper", FoundPaper);
    // const questions = req.body.Questions;
    const questions = req.body;
    console.log("Questions", questions);
    try {
        if (questions) {
            for (let index = 0; index < questions.length; index++) {
                //  for (let indexf = 0; indexf < FoundPaper.Questions.length; indexf++) {
                // if (FoundPaper.Questions[indexf] !== questions[index].QuestionID) {
                FoundPaper.Questions.push(questions[index].QuestionID);
                //  }
                // }
            }
            const updatedPaper = await Paper.findOneAndUpdate({ PaperID: pID }, {
                DateCreated: dateCreated,
                $set: { Questions: FoundPaper.Questions }
            });

            if (updatedPaper == null) {
                return res.status(404).send({ message: "New questions not added", success: false });
            }
            return res.status(200).send({ message: "paper questions have successfully updated", success: true });
        }
    } catch (error) {
        return res.status(400).send({ message: "New questions not added", success: false })
    }
};


//delete a specific paper 
exports.deletePaper = async (req, res) => {
    var pID = req.params.PaperID;
    try {
        const toBeDeleted = await Paper.findOneAndDelete({ PaperID: pID });
        if (!toBeDeleted) {
            return res.status(400).json({ message: "Paper not deleted", error: error.message });
        }
        res.status(201).json({ message: "Paper has deleted successfully" })
    }
    catch (error) {
        return res.status(404).json({ message: "Paper not deleted", error: error.message });
    }
};

//view one paper
exports.viewOnePaper = async (req, res) => {
    const pID = req.params.PaperID;
    const paper = await Paper.findOne({ PaperID: pID })

    if (paper == null) {
        return res.status(404).send({ message: "Paper not found" });
    }
    try {
        const paperQuestions = [];
        for (let index_2 = 0; index_2 < paper.Questions.length; index_2++) {
            paperQuestions.push(await Question.findOne({ QuestionID: paper.Questions[index_2] }));
        }
        const { PaperID, PaperName, PaperType, DateCreated } = paper;
        const fullPaper = {
            PaperID, PaperName, PaperType, DateCreated,
            Questions: paperQuestions
        }
        // fullPapers.push(fullPaper);
        // console.log(fullPaper);
        if (!fullPaper) {
            return res.status(404).json({ message: "paper has not fetch successfully" })
        }
        // res.status(201).json( fullPaper )
        res.status(200).json(Array(fullPaper));
    } catch (error) {
        res.status(404).json({ message: "paper list has not fetch successfully", error: error.message })
    }
}