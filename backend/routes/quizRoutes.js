const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    createQuiz, 
    fetchQuizzes, 
    getQuizById, 
    updateQuiz, 
    deleteQuiz 
} = require("../controllers/quizController");

const router = express.Router();

router.route("/").post(protect, createQuiz);

router.route("/").get(protect, fetchQuizzes);

router.route("/:id").get(protect, getQuizById);

router.route("/:id").put(protect, updateQuiz);

router.route("/:id").delete(protect, deleteQuiz);

module.exports = router;
