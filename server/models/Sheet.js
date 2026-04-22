const mongoose = require('mongoose');

/**
 * Sheet schema — stores spreadsheet data for auto-save functionality.
 * Each sheet belongs to a user and stores the FortuneSheet JSON data.
 */
const sheetSchema = new mongoose.Schema(
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
      maxlength: [100, 'Sheet name cannot exceed 100 characters'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: [{}],
    },
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sheet', sheetSchema);
