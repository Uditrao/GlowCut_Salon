const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['combo', 'membership'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  includedServices: [{
    type: String,
    trim: true
  }],
  originalPrice: {
    type: Number,
    default: 0
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  savingsAmount: {
    type: Number,
    default: 0
  },
  validityDays: {
    type: Number,
    default: 30
  },
  badge: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
