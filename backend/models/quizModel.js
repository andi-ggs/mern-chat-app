const mongoose = require('mongoose');

const quizModel = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        questions: [
            {
                questionText: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        text: { type: String, required: true },
                        isCorrect: { type: Boolean, required: true, default: false } // ✅ Aici e fixat
                    }
                ],
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model('Quiz', quizModel);
module.exports = Quiz;
