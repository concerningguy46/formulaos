const Formula = require('../models/Formula');
const { sanitizeString } = require('../utils/validators');

/**
 * Get all formulas for the logged-in user (personal library).
 * GET /api/formulas
 */
const getMyFormulas = async (req, res, next) => {
  try {
    const { search, tag, sort = '-createdAt' } = req.query;

    const query = { userId: req.user._id };

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const formulas = await Formula.find(query).sort(sort).lean();

    res.json({
      success: true,
      count: formulas.length,
      data: formulas,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single formula by ID.
 * GET /api/formulas/:id
 */
const getFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findById(req.params.id).populate('userId', 'name avatar');

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Formula not found',
      });
    }

    // Only owner can see private formulas
    if (!formula.isPublic && formula.userId._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this formula',
      });
    }

    res.json({ success: true, data: formula });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new formula (save to personal library).
 * POST /api/formulas
 */
const createFormula = async (req, res, next) => {
  try {
    const { name, description, tags, syntax, parameters, isPublic, category } = req.body;

    if (!name || !syntax) {
      return res.status(400).json({
        success: false,
        message: 'Formula name and syntax are required',
      });
    }

    const formula = await Formula.create({
      userId: req.user._id,
      name: sanitizeString(name),
      description: sanitizeString(description),
      tags: tags || [],
      syntax,
      parameters: parameters || [],
      isPublic: isPublic || false,
      category: category || 'other',
    });

    res.status(201).json({ success: true, data: formula });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a formula (only the owner can update).
 * PUT /api/formulas/:id
 */
const updateFormula = async (req, res, next) => {
  try {
    let formula = await Formula.findById(req.params.id);

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Formula not found',
      });
    }

    // Only owner can update
    if (formula.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this formula',
      });
    }

    const allowedUpdates = ['name', 'description', 'tags', 'syntax', 'parameters', 'isPublic', 'price', 'category'];
    const updates = {};

    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'name' || field === 'description'
          ? sanitizeString(req.body[field])
          : req.body[field];
      }
    }

    formula = await Formula.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: formula });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a formula (only the owner can delete).
 * DELETE /api/formulas/:id
 */
const deleteFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findById(req.params.id);

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Formula not found',
      });
    }

    if (formula.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this formula',
      });
    }

    await Formula.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Formula deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Increment usage count when a formula is inserted into a cell.
 * POST /api/formulas/:id/use
 */
const useFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findByIdAndUpdate(
      req.params.id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Formula not found',
      });
    }

    res.json({ success: true, data: formula });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyFormulas, getFormula, createFormula, updateFormula, deleteFormula, useFormula };
