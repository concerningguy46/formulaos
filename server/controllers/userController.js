const User = require('../models/User');
const Formula = require('../models/Formula');
const Pack = require('../models/Pack');

/**
 * Get a creator's public profile with their listings and stats.
 * GET /api/users/:id/profile
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar bio createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's public formulas
    const formulas = await Formula.find({ userId: req.params.id, isPublic: true })
      .sort('-downloadCount')
      .lean();

    // Get user's packs
    const packs = await Pack.find({ userId: req.params.id })
      .sort('-downloadCount')
      .lean();

    // Calculate stats
    const totalDownloads = formulas.reduce((sum, f) => sum + f.downloadCount, 0)
      + packs.reduce((sum, p) => sum + p.downloadCount, 0);

    const totalFormulas = formulas.length;
    const totalPacks = packs.length;
    const avgRating = formulas.length > 0
      ? formulas.reduce((sum, f) => sum + f.rating, 0) / formulas.length
      : 0;

    res.json({
      success: true,
      data: {
        user,
        formulas,
        packs,
        stats: {
          totalFormulas,
          totalPacks,
          totalDownloads,
          avgRating: Math.round(avgRating * 10) / 10,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile };
