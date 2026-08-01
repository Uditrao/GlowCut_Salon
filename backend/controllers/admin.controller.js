const Appointment = require('../models/Appointment');
const Queue = require('../models/Queue');
const Review = require('../models/Review');
const Enquiry = require('../models/Enquiry');
const Service = require('../models/Service');

// GET /api/admin/analytics
const getAdminAnalytics = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const firstDayOfMonthStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [
      todayAppointments,
      monthAppointments,
      todayQueue,
      approvedReviews,
      pendingReviewsCount,
      unreadEnquiriesCount
    ] = await Promise.all([
      Appointment.find({ date: todayStr, status: { $ne: 'cancelled' } }).populate('serviceId', 'name'),
      Appointment.find({ date: { $gte: firstDayOfMonthStr }, status: { $ne: 'cancelled' } }).populate('serviceId', 'name'),
      Queue.findOne({ date: todayStr }).populate('queueList'),
      Review.find({ isApproved: true }).select('rating'),
      Review.countDocuments({ isApproved: false }),
      Enquiry.countDocuments({ isRead: false })
    ]);

    // Bookings & Revenue today
    const bookingsToday = todayAppointments.length;
    const revenueToday = todayAppointments.reduce((acc, appt) => acc + (appt.status === 'completed' ? appt.finalPrice : 0), 0);

    // Queue length
    let queueLength = 0;
    if (todayQueue && todayQueue.queueList) {
      queueLength = todayQueue.queueList.filter(a => a && a.status !== 'completed' && a.status !== 'cancelled').length;
    }

    // Average rating
    let averageRating = 4.8;
    if (approvedReviews.length > 0) {
      const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = parseFloat((sum / approvedReviews.length).toFixed(1));
    }

    // Month metrics
    const totalBookingsThisMonth = monthAppointments.length;
    const revenueThisMonth = monthAppointments.reduce((acc, appt) => acc + (appt.status === 'completed' ? appt.finalPrice : appt.finalPrice), 0);

    // Top Service
    const serviceCounts = {};
    monthAppointments.forEach(appt => {
      if (appt.serviceId && appt.serviceId.name) {
        const sName = appt.serviceId.name;
        serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
      }
    });

    let topService = 'Keratin Treatment';
    let maxCount = 0;
    for (const [name, count] of Object.entries(serviceCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topService = name;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        bookingsToday,
        revenueToday,
        queueLength,
        averageRating,
        totalBookingsThisMonth,
        revenueThisMonth,
        topService,
        pendingReviews: pendingReviewsCount,
        unreadEnquiries: unreadEnquiriesCount
      }
    });
  } catch (error) {
    console.error('[Admin Controller] getAdminAnalytics error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error calculating analytics.' });
  }
};

module.exports = { getAdminAnalytics };
