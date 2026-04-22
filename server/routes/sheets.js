const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Sheet = require('../models/Sheet');

/**
 * Save sheet data (auto-save endpoint).
 * POST /api/sheets/save
 */
router.post('/save', protect, async (req, res, next) => {
  try {
    const { sheetId, name, data } = req.body;

    if (sheetId) {
      // Update existing sheet
      const sheet = await Sheet.findOneAndUpdate(
        { _id: sheetId, userId: req.user._id },
        { data, name, lastSavedAt: new Date() },
        { new: true }
      );

      if (!sheet) {
        return res.status(404).json({ success: false, message: 'Sheet not found' });
      }

      return res.json({ success: true, data: sheet });
    }

    // Create new sheet
    const sheet = await Sheet.create({
      userId: req.user._id,
      name: name || 'Untitled Spreadsheet',
      data,
    });

    res.status(201).json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a sheet by ID.
 * GET /api/sheets/:id
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const sheet = await Sheet.findOne({ _id: req.params.id, userId: req.user._id });

    if (!sheet) {
      return res.status(404).json({ success: false, message: 'Sheet not found' });
    }

    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all sheets for current user.
 * GET /api/sheets
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const sheets = await Sheet.find({ userId: req.user._id })
      .select('name lastSavedAt createdAt')
      .sort('-lastSavedAt');

    res.json({ success: true, data: sheets });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
