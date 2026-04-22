const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckout, handleWebhook } = require('../controllers/paymentController');

// POST /api/payments/checkout — create Stripe checkout session
router.post('/checkout', protect, createCheckout);

// POST /api/payments/webhook — Stripe webhook (uses raw body, configured in server.js)
// Note: This route does NOT use JSON parsing — raw body is needed for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
