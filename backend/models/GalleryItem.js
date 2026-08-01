const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  caption: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Hair Colour', 'Haircuts', 'Bridal', 'Skin', 'Nails', 'Salon Interior'],
    default: 'Haircuts'
  },
  stylistName: {
    type: String,
    trim: true,
    default: 'GlowCut Team'
  },
  serviceName: {
    type: String,
    trim: true
  },
  uploadedByAdmin: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
