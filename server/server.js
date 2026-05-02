const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

// Import routes
const authRoutes = require('./routes/auth');
const formulaRoutes = require('./routes/formulas');
const marketplaceRoutes = require('./routes/marketplace');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const sheetRoutes = require('./routes/sheets');

const app = express();

// ---------------------
// Middleware
// ---------------------

// Security headers
app.use(helmet());

// CORS — allow frontend origins
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://localhost:4173',
      'https://formulaos.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Handle preflight requests
app.options('*', cors())

// Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse JSON bodies (except for Stripe webhook which needs raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.use(cookieParser());

// Passport initialization for Google OAuth
app.use(passport.initialize());
configurePassport();

// Global rate limiting
app.use('/api/', apiLimiter);

// ---------------------
// Routes
// ---------------------

app.use('/api/auth', authRoutes);
app.use('/api/formulas', formulaRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sheets', sheetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    mongodb: mongoConnected ? 'connected' : 'disconnected',
    authStorage: mongoConnected ? 'mongo' : 'file',
    ai: process.env.GEMINI_API_KEY ? 'configured' : 'missing key',
    payments: process.env.STRIPE_SECRET_KEY !== 'disabled' ? 'configured' : 'disabled',
    googleAuth: process.env.GOOGLE_CLIENT_ID !== 'disabled' ? 'configured' : 'disabled',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connected = await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 FormulaOS server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (!connected) {
        console.log('⚠️  Database unavailable, running in API-only dev mode.');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
