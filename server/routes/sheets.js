const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  deepSaveSpreadsheet,
  getSpreadsheet,
  listSpreadsheets,
} = require('../controllers/spreadsheetController');

router.post('/deep-save', protect, deepSaveSpreadsheet);
router.post('/save', protect, deepSaveSpreadsheet);
router.get('/:id', protect, getSpreadsheet);
router.get('/', protect, listSpreadsheets);

module.exports = router;
