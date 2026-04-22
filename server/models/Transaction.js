const mongoose = require('mongoose');

/**
 * Transaction schema — records every marketplace purchase.
 * Tracks buyer, seller, amounts, and platform cut for accounting.
 */
const transactionSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    formulaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Formula',
    },
    packId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pack',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    platformCut: {
      type: Number,
      required: true,
      min: 0,
    },
    sellerPayout: {
      type: Number,
      required: true,
      min: 0,
    },
    stripePaymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
