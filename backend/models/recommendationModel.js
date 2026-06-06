const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        recommendations: [
            {
                quizId: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                },
                difficulty: {
                    type: String,
                },
                score: {
                    type: Number,
                }
            }
        ],
        strategy: {
            type: String,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // TTL index, document will be automatically deleted when expiresAt is reached
        }
    },
    {
        timestamps: true,
    }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;
