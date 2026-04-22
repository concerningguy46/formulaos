const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMyFormulas,
  getFormula,
  createFormula,
  updateFormula,
  deleteFormula,
  useFormula,
} = require('../controllers/formulaController');

// All formula routes require authentication
router.use(protect);

// GET /api/formulas — list user's personal formulas
router.get('/', getMyFormulas);

// GET /api/formulas/:id — get a single formula
router.get('/:id', getFormula);

// POST /api/formulas — create/save a new formula
router.post('/', createFormula);

// PUT /api/formulas/:id — update a formula
router.put('/:id', updateFormula);

// DELETE /api/formulas/:id — delete a formula
router.delete('/:id', deleteFormula);

// POST /api/formulas/:id/use — increment usage count
router.post('/:id/use', useFormula);

module.exports = router;
