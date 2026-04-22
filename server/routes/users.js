const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { getUserProfile } = require('../controllers/userController');

// GET /api/users/:id/profile — public creator profile
router.get('/:id/profile', optionalAuth, getUserProfile);

module.exports = router;
