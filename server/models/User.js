const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User schema — stores authentication info, AI usage tracking, and Stripe account.
 * Password is hashed automatically before save using bcrypt.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    aiUsageThisMonth: {
      type: Number,
      default: 0,
    },
    aiUsageResetDate: {
      type: Date,
      default: Date.now,
    },
    stripeAccountId: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving if it has been modified.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare a candidate password with the stored hashed password.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check and reset AI usage counter if a new month has started.
 */
userSchema.methods.checkAIUsage = function () {
  const now = new Date();
  const resetDate = new Date(this.aiUsageResetDate);

  // Reset if we're in a new month
  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    this.aiUsageThisMonth = 0;
    this.aiUsageResetDate = now;
  }

  const limit = this.plan === 'pro' ? Infinity : 20;
  return {
    used: this.aiUsageThisMonth,
    limit,
    remaining: Math.max(0, limit - this.aiUsageThisMonth),
    canUse: this.aiUsageThisMonth < limit,
  };
};

module.exports = mongoose.model('User', userSchema);
