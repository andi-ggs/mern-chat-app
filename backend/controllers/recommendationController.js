const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Recommendation = require("../models/recommendationModel");
const QuizResult = require("../models/quizResultModel");
const Quiz = require("../models/quizModel");

// @desc    Get recommendations for a user
// @route   GET /api/recommendations/:userId
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ message: "Nu ești autorizat să vezi aceste recomandări." });
    }

    // 1. Return cached recommendations if still valid
    const cached = await Recommendation.findOne({ user: userId });
    if (cached) {
        return res.status(200).json({
            source: "mongodb_cache",
            cached: true,
            strategy: cached.strategy,
            recommendations: cached.recommendations,
            isNewUser: cached.strategy === "popularity_for_new_user",
            generatedAt: cached.createdAt,
            expiresAt: cached.expiresAt,
        });
    }

    // 2. New-user path: no quiz results → build recommendations from real DB data
    const resultCount = await QuizResult.countDocuments({ user: userId });

    if (resultCount === 0) {
        let recommendations = [];

        // Try popularity-based: quizzes solved most often across all users
        const popular = await QuizResult.aggregate([
            { $group: { _id: "$quiz", attempts: { $sum: 1 }, avgScore: { $avg: "$score" } } },
            { $sort: { attempts: -1 } },
            { $limit: 5 },
        ]);

        if (popular.length > 0) {
            const quizDocs = await Quiz.find({ _id: { $in: popular.map((r) => r._id) } }).lean();
            const quizById = Object.fromEntries(quizDocs.map((q) => [q._id.toString(), q]));

            recommendations = popular.map((r) => {
                const avg = r.avgScore ?? 50;
                const difficulty = avg >= 70 ? "ușor" : avg >= 40 ? "mediu" : "greu";
                const relevanceScore = parseFloat(Math.min(r.attempts / 10 + 0.5, 1.0).toFixed(2));
                return {
                    quizId: r._id.toString(),
                    title: quizById[r._id.toString()]?.title ?? "Quiz",
                    score: relevanceScore,
                    difficulty,
                };
            });
        } else {
            // No quiz history at all — return newest quizzes
            const allQuizzes = await Quiz.find({}).sort({ createdAt: -1 }).limit(5).lean();
            recommendations = allQuizzes.map((q, i) => ({
                quizId: q._id.toString(),
                title: q.title,
                score: parseFloat((0.85 - i * 0.05).toFixed(2)),
                difficulty: "ușor",
            }));
        }

        if (recommendations.length === 0) {
            return res.status(200).json({
                source: "new_user",
                strategy: "no_quizzes_available",
                recommendations: [],
                isNewUser: true,
            });
        }

        // Cache for 1 hour; short TTL so it refreshes after the user solves their first quiz
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await Recommendation.findOneAndUpdate(
            { user: userId },
            { user: userId, strategy: "popularity_for_new_user", recommendations, expiresAt },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            source: "new_user_popular",
            strategy: "popularity_for_new_user",
            recommendations,
            isNewUser: true,
        });
    }

    // 3. Existing user: delegate to Flask microservice for collaborative k-NN
    try {
        const flaskResponse = await axios.post("http://localhost:5001/recommend", {
            userId,
        });

        const { strategy, recommendations } = flaskResponse.data;

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await Recommendation.findOneAndUpdate(
            { user: userId },
            { user: userId, strategy, recommendations, expiresAt },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            source: "microservice",
            cached: false,
            strategy,
            recommendations,
            isNewUser: false,
            generatedAt: new Date(),
            expiresAt,
        });
    } catch (error) {
        console.error("Eroare la apelarea microserviciului Flask:", error.message);

        // Graceful fallback: return real quizzes from DB sorted by recency
        const fallbackQuizzes = await Quiz.find({}).sort({ createdAt: -1 }).limit(3).lean();
        const recommendations = fallbackQuizzes.map((q, i) => ({
            quizId: q._id.toString(),
            title: q.title,
            score: parseFloat((0.85 - i * 0.05).toFixed(2)),
            difficulty: "ușor",
        }));

        return res.status(200).json({
            source: "fallback_popularity",
            cached: false,
            strategy: "popularity_fallback",
            recommendations,
            isNewUser: false,
            warning: "Serviciul de recomandări este indisponibil. Afișăm quiz-uri recente.",
        });
    }
});

module.exports = { getRecommendations };
