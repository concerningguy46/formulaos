const mongoose = require('mongoose');

/**
 * Review schema — user ratings and comments on marketplace formulas/packs.
 * Each user can only review a formula/pack once (enforced by compound index).
 */
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    formulaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Formula',
    },
    packId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pack',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per formula/pack
reviewSchema.index({ userId: 1, formulaId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ userId: 1, packId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
