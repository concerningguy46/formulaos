const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection URI from environment variables.
 * Returns false when the database is unavailable so dev can still boot.
 */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI is not set. Starting server without a database connection.');
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
