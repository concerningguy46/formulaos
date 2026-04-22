const Anthropic = require('@anthropic-ai/sdk');
const User = require('../models/User');

// Initialize Anthropic client
const getAnthropicClient = () => {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
};

/**
 * System prompt for formula generation — specializes Claude for spreadsheet tasks.
 */
const FORMULA_SYSTEM_PROMPT = `You are FormulaOS AI — an expert spreadsheet formula assistant. Your job is to generate spreadsheet formulas based on plain English descriptions.

RULES:
1. Always return a valid spreadsheet formula (Excel/Google Sheets compatible)
2. Use the column headers and sample data provided as context when available
3. Explain each part of the formula in simple, plain English
4. If the request is ambiguous, make reasonable assumptions and explain them
5. Never make up functions that don't exist

RESPONSE FORMAT (always use this exact JSON structure):
{
  "formula": "=YOUR_FORMULA_HERE",
  "explanation": [
    "Step 1: explanation...",
    "Step 2: explanation...",
    "Step 3: explanation..."
  ],
  "suggestedName": "A short name for this formula",
  "assumptions": ["Any assumptions you made"]
}`;

/**
 * System prompt for formula explanation.
 */
const EXPLAINER_SYSTEM_PROMPT = `You are FormulaOS AI — an expert at explaining spreadsheet formulas in plain English.

RULES:
1. Break down each part of the formula step by step
2. Use simple language — the user is NOT technical
3. Explain what happens for different input values (give examples)
4. If the formula has errors, point them out and suggest corrections

RESPONSE FORMAT (always use this exact JSON structure):
{
  "summary": "One-sentence summary of what this formula does",
  "steps": [
    "Step 1: explanation...",
    "Step 2: explanation...",
    "Step 3: explanation..."
  ],
  "examples": [
    { "input": "If A2 = 100", "output": "Result would be..." }
  ],
  "tips": ["Any helpful tips or warnings"]
}`;

/**
 * Generate a formula from a plain English description.
 * POST /api/ai/generate
 */
const generateFormula = async (req, res, next) => {
  try {
    const { description, columnHeaders, sampleData } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Please describe what formula you need',
      });
    }

    // Check AI usage limits
    const user = await User.findById(req.user._id);
    const usage = user.checkAIUsage();

    if (!usage.canUse) {
      return res.status(429).json({
        success: false,
        message: `You've used all ${usage.limit} AI generations this month. Upgrade to Pro for unlimited.`,
        data: { usage },
      });
    }

    // Build context from sheet data
    let context = '';
    if (columnHeaders && columnHeaders.length > 0) {
      context += `\n\nSheet column headers: ${columnHeaders.join(', ')}`;
    }
    if (sampleData) {
      context += `\n\nSample data from the sheet:\n${JSON.stringify(sampleData, null, 2)}`;
    }

    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: FORMULA_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a spreadsheet formula for: "${description}"${context}`,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    let parsed;

    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      // If parsing fails, return raw response
      parsed = {
        formula: responseText,
        explanation: ['See the generated formula above'],
        suggestedName: 'AI Generated Formula',
        assumptions: [],
      };
    }

    // Increment usage counter
    user.aiUsageThisMonth += 1;
    await user.save();

    res.json({
      success: true,
      data: {
        ...parsed,
        usage: user.checkAIUsage(),
      },
    });
  } catch (error) {
    // Handle Anthropic API errors specifically
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please contact support.',
      });
    }
    next(error);
  }
};

/**
 * Explain a formula in plain English.
 * POST /api/ai/explain
 */
const explainFormula = async (req, res, next) => {
  try {
    const { formula } = req.body;

    if (!formula) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a formula to explain',
      });
    }

    // Check AI usage limits
    const user = await User.findById(req.user._id);
    const usage = user.checkAIUsage();

    if (!usage.canUse) {
      return res.status(429).json({
        success: false,
        message: `You've used all ${usage.limit} AI generations this month. Upgrade to Pro for unlimited.`,
        data: { usage },
      });
    }

    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: EXPLAINER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Explain this spreadsheet formula: ${formula}`,
        },
      ],
    });

    const responseText = message.content[0].text;
    let parsed;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      parsed = {
        summary: 'See the explanation below',
        steps: [responseText],
        examples: [],
        tips: [],
      };
    }

    // Increment usage counter
    user.aiUsageThisMonth += 1;
    await user.save();

    res.json({
      success: true,
      data: {
        ...parsed,
        usage: user.checkAIUsage(),
      },
    });
  } catch (error) {
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please contact support.',
      });
    }
    next(error);
  }
};

module.exports = { generateFormula, explainFormula };
