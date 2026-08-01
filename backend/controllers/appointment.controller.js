const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Stylist = require('../models/Stylist');
const Queue = require('../models/Queue');
const PromoCode = require('../models/PromoCode');
const mongoose = require('mongoose');

// POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, serviceId, stylistId, date, timeSlot, promoCode, notes } = req.body;

    // Basic Validation
    if (!customerName || !customerPhone || !serviceId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields: name, phone, service, date, and time slot.' });
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian phone number starting with 6-9.' });
    }

    // Date validation
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ success: false, message: 'Cannot book appointments for past dates.' });
    }

    if (bookingDate.getDay() === 1) {
      return res.status(400).json({ success: false, message: 'Salon is closed on Mondays.' });
    }

    // Service check
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid service selected.' });
    }
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Selected service is no longer available.' });
    }

    // Stylist handle
    let selectedStylistId = stylistId;
    if (stylistId === 'any' || !stylistId) {
      const allStylists = await Stylist.find({ isAvailable: true });
      if (!allStylists || allStylists.length === 0) {
        return res.status(400).json({ success: false, message: 'No stylists available at the moment.' });
      }

      // Find first stylist free at this slot
      for (const st of allStylists) {
        const existing = await Appointment.findOne({
          stylistId: st._id,
          date,
          timeSlot,
          status: { $ne: 'cancelled' }
        });
        if (!existing) {
          selectedStylistId = st._id;
          break;
        }
      }
      if (selectedStylistId === 'any') {
        selectedStylistId = allStylists[0]._id; // Fallback
      }
    } else {
      if (!mongoose.Types.ObjectId.isValid(stylistId)) {
        return res.status(400).json({ success: false, message: 'Invalid stylist selected.' });
      }
      const existingAppt = await Appointment.findOne({
        stylistId: selectedStylistId,
        date,
        timeSlot,
        status: { $ne: 'cancelled' }
      });
      if (existingAppt) {
        return res.status(400).json({ success: false, message: 'This time slot is already booked for the selected stylist.' });
      }
    }

    // Pricing & Promo Code calculation
    const originalPrice = service.price;
    let discountAmount = 0;
    let validPromoCode = null;

    if (promoCode && promoCode.trim() !== '') {
      const codeUpper = promoCode.trim().toUpperCase();
      const foundPromo = await PromoCode.findOne({ code: codeUpper, isActive: true });

      if (foundPromo) {
        const now = new Date();
        if (now <= foundPromo.expiryDate && foundPromo.usedCount < foundPromo.maxUsageCount && originalPrice >= foundPromo.minOrderValue) {
          validPromoCode = foundPromo.code;
          if (foundPromo.discountType === 'percentage') {
            discountAmount = Math.round((originalPrice * foundPromo.discountValue) / 100);
          } else {
            discountAmount = foundPromo.discountValue;
          }
          // Increment promo usage counter
          await PromoCode.findByIdAndUpdate(foundPromo._id, { $inc: { usedCount: 1 } });
        }
      }
    }

    const finalPrice = Math.max(0, originalPrice - discountAmount);

    // Queue & Token generation
    let queue = await Queue.findOne({ date });
    if (!queue) {
      queue = await Queue.create({
        date,
        currentTokenBeingServed: null,
        totalTokensIssued: 0,
        queueList: []
      });
    }

    const newTotalTokens = queue.totalTokensIssued + 1;
    const tokenNumber = `A-${String(newTotalTokens).padStart(3, '0')}`;

    // Create Appointment
    const appointment = await Appointment.create({
      customerName,
      customerPhone: cleanPhone,
      customerEmail: customerEmail || '',
      serviceId,
      stylistId: selectedStylistId,
      date,
      timeSlot,
      status: 'confirmed',
      tokenNumber,
      promoCode: validPromoCode,
      originalPrice,
      discountAmount,
      finalPrice,
      notes: notes || ''
    });

    // Update Queue
    queue.totalTokensIssued = newTotalTokens;
    if (!queue.currentTokenBeingServed) {
      queue.currentTokenBeingServed = tokenNumber;
    }
    queue.queueList.push(appointment._id);
    await queue.save();

    // Populate appointment response details
    const populated = await Appointment.findById(appointment._id)
      .populate('serviceId', 'name category price durationMinutes')
      .populate('stylistId', 'name photo specializations');

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: populated
    });
  } catch (error) {
    console.error('[Appointment Controller] createAppointment error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating appointment.' });
  }
};

// GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findById(id)
      .populate('serviceId', 'name category price durationMinutes')
      .populate('stylistId', 'name photo specializations');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error('[Appointment Controller] getAppointmentById error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching appointment.' });
  }
};

// PATCH /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Remove from queue if present
    await Queue.updateOne(
      { date: appointment.date },
      { $pull: { queueList: appointment._id } }
    );

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      data: appointment
    });
  } catch (error) {
    console.error('[Appointment Controller] cancelAppointment error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error cancelling appointment.' });
  }
};

// GET /api/admin/appointments (Admin)
const getAdminAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    const filter = {};

    if (date) {
      filter.date = date;
    }
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('serviceId', 'name category price durationMinutes')
      .populate('stylistId', 'name photo')
      .sort({ date: -1, timeSlot: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('[Appointment Controller] getAdminAppointments error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching admin appointments.' });
  }
};

// PATCH /api/admin/appointments/:id/status (Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status.' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: appointment
    });
  } catch (error) {
    console.error('[Appointment Controller] updateAppointmentStatus error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  cancelAppointment,
  getAdminAppointments,
  updateAppointmentStatus
};
