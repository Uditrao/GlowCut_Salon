const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    enum: ['General Enquiry', 'Appointment Help', 'Feedback', 'Partnership', 'Other'],
    default: 'General Enquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: 10
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
