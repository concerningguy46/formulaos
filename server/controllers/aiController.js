const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

exports.generateFormula = async (req, res) => {
  try {
    const { description, sheetContext } = req.body
    if (!description) {
      return res.status(400).json({ message: 'Description is required' })
    }

    if (req.user) {
      const User = require('../models/User')
      const user = await User.findById(req.user._id)
      if (user.aiUsageThisMonth >= 20) {
        return res.status(429).json({
          message: 'Monthly AI limit reached. Upgrade to Pro for unlimited generations.',
          limitReached: true
        })
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a spreadsheet formula expert. 
    The user wants a formula that does: ${description}
    ${sheetContext ? `Sheet context (column headers and sample data): ${JSON.stringify(sheetContext)}` : ''}
    
    Respond ONLY in this exact JSON format with no extra text:
    {
      "formula": "=THE_FORMULA_HERE",
      "explanation": "Plain English step by step explanation of what this formula does",
      "steps": ["step 1", "step 2", "step 3"]
    }`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    if (req.user) {
      const User = require('../models/User')
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiUsageThisMonth: 1 }
      })
    }

    res.json(parsed)
  } catch (error) {
    console.error('AI generate error:', error)
    res.status(500).json({ message: 'AI generation failed', error: error.message })
  }
}

exports.explainFormula = async (req, res) => {
  try {
    const { formula } = req.body
    if (!formula) {
      return res.status(400).json({ message: 'Formula is required' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a spreadsheet expert. Explain this formula in plain English for a non-technical user:
    Formula: ${formula}
    
    Respond ONLY in this exact JSON format with no extra text:
    {
      "summary": "One sentence summary of what this formula does",
      "steps": ["step 1 explanation", "step 2 explanation", "step 3 explanation"],
      "example": "A practical example of when to use this"
    }`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    res.json(parsed)
  } catch (error) {
    console.error('AI explain error:', error)
    res.status(500).json({ message: 'AI explanation failed', error: error.message })
  }
}
