/**
 * ====================================
 * Central Dashboard Hub — Backend Server
 * ====================================
 *
 * Entry point for the Express API.
 * Sets up middleware, routes, and connects to MongoDB.
 *
 * Stack: Node.js, Express, MongoDB (Mongoose)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// ====================================
// Global Middleware
// ====================================

// Security headers
app.use(helmet());

// CORS — allow frontend to make requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// ====================================
// API Routes
// ====================================

// Auth routes (login endpoints)
app.use('/api', authRoutes);

// Dashboard routes (CRUD)
app.use('/api/dashboards', dashboardRoutes);

// User management routes (admin only)
app.use('/api/users', userRoutes);

// ====================================
// Health Check
// ====================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Central Dashboard Hub API is running',
    timestamp: new Date().toISOString(),
  });
});

// ====================================
// 404 Handler — Catch unmatched routes
// ====================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ====================================
// Global Error Handler (must be last)
// ====================================
app.use(errorHandler);

// ====================================
// Start Server
// ====================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
