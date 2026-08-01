const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  date: {
    type: String, // Format YYYY-MM-DD
    required: true,
    unique: true
  },
  currentTokenBeingServed: {
    type: String,
    default: null
  },
  totalTokensIssued: {
    type: Number,
    default: 0
  },
  queueList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  averageServiceDurationMinutes: {
    type: Number,
    default: 35
  }
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);
