const Formula = require('../models/Formula');
const Pack = require('../models/Pack');
const { sanitizeString, passesSpamCheck } = require('../utils/validators');

/**
 * Browse marketplace — search, filter, sort, paginate public formulas.
 * GET /api/marketplace
 */
const browseMarketplace = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sort = '-createdAt',
      type = 'all', // 'formula', 'pack', 'all'
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build base query for public items
    const baseQuery = { isPublic: true };

    if (category && category !== 'all') {
      baseQuery.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      baseQuery.price = {};
      if (minPrice !== undefined) baseQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) baseQuery.price.$lte = parseFloat(maxPrice);
    }

    let results = [];
    let total = 0;

    if (type === 'formula' || type === 'all') {
      const formulaQuery = { ...baseQuery };
      if (search) {
        formulaQuery.$text = { $search: search };
      }

      const formulas = await Formula.find(formulaQuery)
        .populate('userId', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const formulaCount = await Formula.countDocuments(formulaQuery);

      results = results.concat(
        formulas.map((f) => ({ ...f, itemType: 'formula' }))
      );
      total += formulaCount;
    }

    if (type === 'pack' || type === 'all') {
      const packQuery = {};
      if (category && category !== 'all') packQuery.category = category;
      if (search) {
        packQuery.$text = { $search: search };
      }

      const packs = await Pack.find(packQuery)
        .populate('userId', 'name avatar')
        .populate('formulaIds', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const packCount = await Pack.countDocuments(packQuery);

      results = results.concat(
        packs.map((p) => ({ ...p, itemType: 'pack' }))
      );
      total += packCount;
    }

    res.json({
      success: true,
      count: results.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single marketplace listing (formula or pack) by ID.
 * GET /api/marketplace/:id
 */
const getListingDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type = 'formula' } = req.query;

    let listing;

    if (type === 'pack') {
      listing = await Pack.findById(id)
        .populate('userId', 'name avatar bio')
        .populate('formulaIds', 'name description syntax');
    } else {
      listing = await Formula.findById(id)
        .populate('userId', 'name avatar bio');
    }

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // If paid formula, hide syntax for non-owners
    const data = listing.toObject();
    if (data.price > 0 && data.userId._id.toString() !== req.user?._id?.toString()) {
      data.syntax = '[Purchase to view formula]';
    }

    res.json({ success: true, data: { ...data, itemType: type } });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload a formula or pack to the marketplace.
 * POST /api/marketplace/upload
 */
const uploadToMarketplace = async (req, res, next) => {
  try {
    const { name, description, tags, syntax, parameters, price, category, type } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    // Spam check
    if (!passesSpamCheck(name, description)) {
      return res.status(400).json({
        success: false,
        message: 'Content did not pass quality check. Please use a descriptive name and description.',
      });
    }

    if (type === 'pack') {
      const { formulaIds } = req.body;

      if (!formulaIds || formulaIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'A pack must contain at least one formula',
        });
      }

      const pack = await Pack.create({
        userId: req.user._id,
        name: sanitizeString(name),
        description: sanitizeString(description),
        tags: tags || [],
        category: category || 'other',
        formulaIds,
        price: price || 0,
      });

      return res.status(201).json({ success: true, data: { ...pack.toObject(), itemType: 'pack' } });
    }

    // Upload single formula
    if (!syntax) {
      return res.status(400).json({
        success: false,
        message: 'Formula syntax is required',
      });
    }

    const formula = await Formula.create({
      userId: req.user._id,
      name: sanitizeString(name),
      description: sanitizeString(description),
      tags: tags || [],
      syntax,
      parameters: parameters || [],
      isPublic: true,
      price: price || 0,
      category: category || 'other',
    });

    res.status(201).json({ success: true, data: { ...formula.toObject(), itemType: 'formula' } });
  } catch (error) {
    next(error);
  }
};

/**
 * Download a free formula from the marketplace (adds to user's library).
 * POST /api/marketplace/:id/download
 */
const downloadFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findById(req.params.id);

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Formula not found',
      });
    }

    if (formula.price > 0) {
      return res.status(402).json({
        success: false,
        message: 'This is a paid formula. Please purchase it first.',
      });
    }

    // Create a copy in user's library
    const savedFormula = await Formula.create({
      userId: req.user._id,
      name: formula.name,
      description: formula.description,
      tags: formula.tags,
      syntax: formula.syntax,
      parameters: formula.parameters,
      isPublic: false,
      category: formula.category,
    });

    // Increment download count on original
    await Formula.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });

    res.status(201).json({ success: true, data: savedFormula });
  } catch (error) {
    next(error);
  }
};

module.exports = { browseMarketplace, getListingDetail, uploadToMarketplace, downloadFormula };
