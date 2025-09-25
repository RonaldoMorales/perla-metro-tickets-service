const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Imports database config
const connectDB = require('./config/database');

const app = express();

// Conects Database
connectDB();

// Basic Middlewares
app.use(cors());
app.use(express.json());

// Testing Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Tickets Service is running!',
    service: 'perla-metro-tickets-service',
    timestamp: new Date().toISOString(),
    database: 'MongoDB connected'
  });
});

// Health Route
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
});

module.exports = app;