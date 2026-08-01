const mongoose = require('mongoose');

const stylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Stylist name is required'],
    trim: true
  },
  photo: {
    type: String,
    default: '/assets/images/stylist-placeholder.jpg'
  },
  specializations: [{
    type: String,
    trim: true
  }],
  experienceYears: {
    type: Number,
    default: 1
  },
  bio: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Stylist', stylistSchema);
