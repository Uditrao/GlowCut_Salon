const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db.js');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const stylistRoutes = require('./routes/stylist.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const queueRoutes = require('./routes/queue.routes');
const packageRoutes = require('./routes/package.routes');
const promoRoutes = require('./routes/promo.routes');
const reviewRoutes = require('./routes/review.routes');
const aiRoutes = require('./routes/ai.routes');
const galleryRoutes = require('./routes/gallery.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const adminRoutes = require('./routes/admin.routes');

// Connect to MongoDB
connectDB();

const app = express();

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Files for direct integrated testing
app.use(express.static(path.join(__dirname, '../frontend')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stylists', stylistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/admin', adminRoutes);

// Root & Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'GlowCut Salon Backend API is running smoothly.' });
});

// Fallback 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found.` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`✨ GlowCut Salon Backend Server running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  console.log(`==================================================`);
});
