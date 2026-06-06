const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Recommendation = require("../models/recommendationModel");

// @desc    Get recommendations for a user
// @route   GET /api/recommendations/:userId
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Asigură-te că utilizatorul solicită recomandările pentru el însuși
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ message: "Nu ești autorizat să vezi aceste recomandări." });
    }

    // 1. Verifică în cache (MongoDB)
    const cachedRecommendation = await Recommendation.findOne({ user: userId });
    
    if (cachedRecommendation) {
        return res.status(200).json({
            source: "mongodb_cache",
            cached: true,
            strategy: cachedRecommendation.strategy,
            recommendations: cachedRecommendation.recommendations,
            generatedAt: cachedRecommendation.createdAt,
            expiresAt: cachedRecommendation.expiresAt
        });
    }

    // 2. Dacă nu e în cache, apelează microserviciul Flask
    try {
        const flaskResponse = await axios.post('http://localhost:5001/recommend', {
            userId: userId,
            preferences: {
                chapters: ["algebră"], // Exemplu, ar trebui extras din profilul userului
                difficulty: "ușor"
            }
        });

        const { strategy, recommendations } = flaskResponse.data;

        // 3. Salvează în cache cu TTL de 24 ore
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const newRecommendation = await Recommendation.create({
            user: userId,
            strategy: strategy,
            recommendations: recommendations,
            expiresAt: expiresAt
        });

        return res.status(200).json({
            source: "microservice",
            cached: false,
            strategy: strategy,
            recommendations: recommendations,
            generatedAt: newRecommendation.createdAt,
            expiresAt: newRecommendation.expiresAt
        });

    } catch (error) {
        console.error("Eroare la apelarea microserviciului Flask:", error.message);
        
        // Graceful fallback: returnăm quiz-uri populare dacă Flask e jos
        return res.status(200).json({
            source: "fallback_popularity",
            cached: false,
            strategy: "popularity_fallback",
            recommendations: [
                { quizId: "q_algebra_1", title: "Ecuații simple", difficulty: "ușor", score: 0.9 },
                { quizId: "q_geom_1", title: "Arii și perimetre", difficulty: "ușor", score: 0.85 }
            ],
            warning: "Recommendation service unavailable, showing popular quizzes"
        });
    }
});

module.exports = {
    getRecommendations
};
