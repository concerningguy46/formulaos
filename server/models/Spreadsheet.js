const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema(
  {
    rawValue: {
      type: String,
      default: '',
    },
    computedValue: {
      type: String,
      default: '',
    },
    dependencies: {
      type: [String],
      default: [],
    },
    dependents: {
      type: [String],
      default: [],
    },
    error: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  }
);

const savedFormulaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    expression: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const spreadsheetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      default: 'Untitled Spreadsheet',
      trim: true,
      maxlength: [100, 'Spreadsheet name cannot exceed 100 characters'],
    },
    cells: {
      type: Map,
      of: cellSchema,
      default: () => new Map(),
    },
    savedFormulas: {
      type: [savedFormulaSchema],
      default: [],
    },
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    minimize: false,
    toJSON: {
      flattenMaps: true,
    },
    toObject: {
      flattenMaps: true,
    },
  }
);

spreadsheetSchema.index({ userId: 1, lastSavedAt: -1 });

module.exports = mongoose.model('Spreadsheet', spreadsheetSchema);
