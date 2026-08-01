const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getAdminAnalytics } = require('../controllers/admin.controller');
const { getAdminAppointments, updateAppointmentStatus } = require('../controllers/appointment.controller');
const { getPendingReviews, approveReview, deleteReview } = require('../controllers/review.controller');
const { uploadAdminPhoto, approveGalleryPhoto, deleteGalleryPhoto } = require('../controllers/gallery.controller');
const { getAdminEnquiries, markEnquiryRead, deleteEnquiry } = require('../controllers/enquiry.controller');
const { getAdminPromos, createPromoCode } = require('../controllers/promo.controller');
const { uploadGalleryImage } = require('../middleware/upload.middleware');

// All routes here are protected and require admin privileges
router.use(protect, adminOnly);

// Analytics
router.get('/analytics', getAdminAnalytics);

// Appointments
router.get('/appointments', getAdminAppointments);
router.patch('/appointments/:id/status', updateAppointmentStatus);

// Reviews Moderation
router.get('/reviews/pending', getPendingReviews);
router.patch('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', deleteReview);

// Gallery Uploads & Moderation
router.post('/gallery', uploadGalleryImage.single('image'), uploadAdminPhoto);
router.patch('/gallery/:id/approve', approveGalleryPhoto);
router.delete('/gallery/:id', deleteGalleryPhoto);

// Enquiries Inbox
router.get('/enquiries', getAdminEnquiries);
router.patch('/enquiries/:id/read', markEnquiryRead);
router.delete('/enquiries/:id', deleteEnquiry);

// Promo Codes
router.get('/promos', getAdminPromos);
router.post('/promos', createPromoCode);

module.exports = router;
