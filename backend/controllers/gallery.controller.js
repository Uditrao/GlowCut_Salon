const GalleryItem = require('../models/GalleryItem');
const mongoose = require('mongoose');

// GET /api/gallery
const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isApproved: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('[Gallery Controller] getGallery error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching gallery.' });
  }
};

// POST /api/gallery (Customer submission)
const uploadCustomerPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file.' });
    }

    const { caption, category, stylistName, serviceName } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const item = await GalleryItem.create({
      imageUrl,
      caption: caption || 'Transformation by GlowCut Salon',
      category: category || 'Haircuts',
      stylistName: stylistName || 'GlowCut Stylist',
      serviceName: serviceName || '',
      uploadedByAdmin: false,
      isApproved: false // Requires admin moderation
    });

    return res.status(201).json({
      success: true,
      message: 'Photo submitted for review! It will appear in the gallery once approved.',
      data: item
    });
  } catch (error) {
    console.error('[Gallery Controller] uploadCustomerPhoto error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error submitting photo.' });
  }
};

// POST /api/admin/gallery (Admin upload)
const uploadAdminPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file.' });
    }

    const { caption, category, stylistName, serviceName } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const item = await GalleryItem.create({
      imageUrl,
      caption: caption || 'Official GlowCut Showcase',
      category: category || 'Haircuts',
      stylistName: stylistName || 'Senior Stylist',
      serviceName: serviceName || '',
      uploadedByAdmin: true,
      isApproved: true // Auto approved
    });

    return res.status(201).json({
      success: true,
      message: 'Gallery photo uploaded successfully.',
      data: item
    });
  } catch (error) {
    console.error('[Gallery Controller] uploadAdminPhoto error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error uploading gallery photo.' });
  }
};

// PATCH /api/admin/gallery/:id/approve (Admin)
const approveGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID.' });
    }

    const item = await GalleryItem.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    return res.status(200).json({ success: true, message: 'Gallery photo approved.', data: item });
  } catch (error) {
    console.error('[Gallery Controller] approveGalleryPhoto error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error approving photo.' });
  }
};

// DELETE /api/admin/gallery/:id (Admin)
const deleteGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID.' });
    }

    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    return res.status(200).json({ success: true, message: 'Gallery item deleted.' });
  } catch (error) {
    console.error('[Gallery Controller] deleteGalleryPhoto error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting photo.' });
  }
};

module.exports = {
  getGallery,
  uploadCustomerPhoto,
  uploadAdminPhoto,
  approveGalleryPhoto,
  deleteGalleryPhoto
};
