const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const generateToken = require('../utils/generateToken');

// Register with email/password
router.post('/register', authLimiter, register);

// Login with email/password
router.post('/login', authLimiter, login);

// Get current user profile
router.get('/me', protect, getMe);

// Google OAuth — redirect to Google login page
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback — handle the redirect from Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT for the authenticated Google user
    const token = generateToken(req.user._id);
    // Redirect to frontend with token in query param
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
