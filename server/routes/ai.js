const express = require('express')
const router = express.Router()
const { generateFormula, explainFormula } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

router.post('/generate', protect, generateFormula)
router.post('/explain', protect, explainFormula)

module.exports = router
