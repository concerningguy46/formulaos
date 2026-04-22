const mongoose = require('mongoose');

/**
 * Pack schema — a curated collection of related formulas.
 * Sold or shared as a bundle on the marketplace.
 */
const packSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Pack name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['finance', 'education', 'hr', 'marketing', 'operations', 'personal', 'other'],
      default: 'other',
    },
    formulaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formula',
      },
    ],
    price: {
      type: Number,
      default: 0,
      min: 0,
      max: 49,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for marketplace search
packSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Pack', packSchema);
