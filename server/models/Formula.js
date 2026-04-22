const mongoose = require('mongoose');

/**
 * Formula schema — stores user-created formulas with marketplace metadata.
 * Can be private (personal library) or public (marketplace listing).
 */
const formulaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Formula name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    tags: {
      type: [String],
      default: [],
      validate: [arrayLimit, 'Too many tags (max 10)'],
    },
    category: {
      type: String,
      enum: ['finance', 'education', 'hr', 'marketing', 'operations', 'personal', 'other'],
      default: 'other',
    },
    syntax: {
      type: String,
      required: [true, 'Formula syntax is required'],
      maxlength: [2000, 'Syntax cannot exceed 2000 characters'],
    },
    parameters: [
      {
        name: { type: String, required: true },
        cellRef: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
      max: [49, 'Price cannot exceed $49'],
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    usageCount: {
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

/** Validate max number of tags */
function arrayLimit(val) {
  return val.length <= 10;
}

// Text index for marketplace search
formulaSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Formula', formulaSchema);
