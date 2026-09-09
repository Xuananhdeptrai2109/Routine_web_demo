const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// GET /api/v1/search/suggestions?q=... (Gợi ý autocomplete)
router.get('/suggestions', searchController.getSuggestions);

// GET /api/v1/search/trending (Từ khóa hot)
router.get('/trending', searchController.getTrendingKeywords);

module.exports = router;
