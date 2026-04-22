const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  browseMarketplace,
  getListingDetail,
  uploadToMarketplace,
  downloadFormula,
} = require('../controllers/marketplaceController');

// GET /api/marketplace — browse (public, optional auth for personalized results)
router.get('/', optionalAuth, browseMarketplace);

// GET /api/marketplace/:id — listing detail (optional auth to check ownership)
router.get('/:id', optionalAuth, getListingDetail);

// POST /api/marketplace/upload — upload formula/pack (requires auth)
router.post('/upload', protect, uploadToMarketplace);

// POST /api/marketplace/:id/download — download free formula (requires auth)
router.post('/:id/download', protect, downloadFormula);

module.exports = router;
