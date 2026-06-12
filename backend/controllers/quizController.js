const asyncHandler = require("express-async-handler");
const Quiz = require("../models/quizModel");
const User = require("../models/userModel");

// Crează un nou quiz
const createQuiz = asyncHandler(async (req, res) => {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ message: "Titlul și întrebările sunt necesare!" });
    }

    try {
        const newQuiz = await Quiz.create({
            title,
            description,
            questions,
            createdBy: req.user._id,
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Obține toate quiz-urile unui utilizator
const fetchQuizzes = asyncHandler(async (req, res) => {
    try {
        const quizzes = await Quiz.find({}).sort({ createdAt: -1 }).populate("createdBy", "name email");
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Obține un quiz după ID
const getQuizById = asyncHandler(async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");
        
        if (!quiz) {
            return res.status(404).json({ message: "Quiz-ul nu a fost găsit!" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Actualizează un quiz
const updateQuiz = asyncHandler(async (req, res) => {
    const { title, description, questions } = req.body;

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { title, description, questions },
            { new: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz-ul nu a fost găsit!" });
        }

        res.status(200).json(updatedQuiz);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Șterge un quiz
const deleteQuiz = asyncHandler(async (req, res) => {
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!deletedQuiz) {
            return res.status(404).json({ message: "Quiz-ul nu a fost găsit!" });
        }

        res.status(200).json({ message: "Quiz-ul a fost șters cu succes!" });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Trimite rezultatul unui quiz
const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId, answers, score, durationSeconds } = req.body;
    const QuizResult = require("../models/quizResultModel");
    const Recommendation = require("../models/recommendationModel");

    if (!quizId || score === undefined) {
        return res.status(400).json({ message: "Quiz ID și scorul sunt necesare!" });
    }

    try {
        const result = await QuizResult.create({
            user: req.user._id,
            quiz: quizId,
            score,
            answers,
            durationSeconds
        });

        // Invalidate cached recommendations so the next visit re-runs the algorithm
        await Recommendation.deleteOne({ user: req.user._id });

        res.status(201).json(result);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    createQuiz,
    fetchQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
};
