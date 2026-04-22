const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');
const { generateFormula, explainFormula } = require('../controllers/aiController');

// All AI routes require authentication and rate limiting
router.use(protect);
router.use(aiLimiter);

// POST /api/ai/generate — generate formula from plain English
router.post('/generate', generateFormula);

// POST /api/ai/explain — explain a formula in plain English
router.post('/explain', explainFormula);

module.exports = router;
