const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Hair', 'Skin', 'Nails', 'Makeup', 'Spa', "Men's"]
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 5
  },
  imageUrl: {
    type: String,
    default: '/assets/images/service-placeholder.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
