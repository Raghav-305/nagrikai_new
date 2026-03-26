const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

module.exports = app;
