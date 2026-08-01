const Enquiry = require('../models/Enquiry');
const mongoose = require('mongoose');

// POST /api/enquiry
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill name, email, and message.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      subject: subject || 'General Enquiry',
      message: message.trim(),
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been received! We'll get back to you within 24 hours.",
      data: enquiry
    });
  } catch (error) {
    console.error('[Enquiry Controller] submitEnquiry error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error submitting enquiry.' });
  }
};

// GET /api/admin/enquiries (Admin)
const getAdminEnquiries = async (req, res) => {
  try {
    const { isRead } = req.query;
    const filter = {};
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error('[Enquiry Controller] getAdminEnquiries error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching enquiries.' });
  }
};

// PATCH /api/admin/enquiries/:id/read (Admin)
const markEnquiryRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.status(200).json({ success: true, message: 'Enquiry marked as read.', data: enquiry });
  } catch (error) {
    console.error('[Enquiry Controller] markEnquiryRead error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating enquiry.' });
  }
};

// DELETE /api/admin/enquiries/:id (Admin)
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
    }

    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.status(200).json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    console.error('[Enquiry Controller] deleteEnquiry error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting enquiry.' });
  }
};

module.exports = {
  submitEnquiry,
  getAdminEnquiries,
  markEnquiryRead,
  deleteEnquiry
};
