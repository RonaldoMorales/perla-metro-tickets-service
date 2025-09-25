const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database configuration
const connectDB = require('./config/database');

// Import routes
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Connect to database
connectDB();

// Basic middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tickets', ticketRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tickets Service is running!',
    service: 'perla-metro-tickets-service',
    timestamp: new Date().toISOString(),
    database: 'MongoDB connected',
    endpoints: {
      tickets: '/api/tickets'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'Tickets Service',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚇 Tickets Service running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/api/tickets`);
});

module.exports = app;