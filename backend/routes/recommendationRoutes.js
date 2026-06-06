const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.route("/:userId").get(protect, getRecommendations);

module.exports = router;
