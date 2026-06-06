const mongoose = require('mongoose');

const quizResultSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        durationSeconds: {
            type: Number,
        },
        answers: [
            {
                type: Number, // Index of the selected option
            }
        ]
    },
    {
        timestamps: true,
    }
);

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
module.exports = QuizResult;
