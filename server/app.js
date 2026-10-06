const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware (Demonstrating Express middleware for lab)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 📡 ${req.method} request to ${req.url}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================

// 1. Hello World Route (Lab Concept Requirement)
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚗 Welcome to the Vehicle Rental System API!',
    status: 'Running',
    version: '1.0.0',
    documentation: {
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
      subqueryDemo: '/api/vehicles/demo/above-average',
      health: '/api/health',
    },
  });
});

// 2. Health Check & Diagnostics Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    databaseMode: db.getIsUsingMock() ? 'Fallback (In-Memory)' : 'MySQL Connected',
  });
});

// 3. Mount API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found. Please check endpoint spelling.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`🚀 [Express Server] Running on http://localhost:${PORT}`);
  console.log(`🚗 [Vehicles API]   http://localhost:${PORT}/api/vehicles`);
  console.log(`📋 [Bookings API]   http://localhost:${PORT}/api/bookings`);
  console.log('====================================================');

  // Test MySQL Connection upon startup
  await db.testConnection();
});

module.exports = app;
