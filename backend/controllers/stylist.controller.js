const Stylist = require('../models/Stylist');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// GET /api/stylists
const getStylists = async (req, res) => {
  try {
    const stylists = await Stylist.find({ isAvailable: true }).sort({ rating: -1, name: 1 });
    return res.status(200).json({
      success: true,
      count: stylists.length,
      data: stylists
    });
  } catch (error) {
    console.error('[Stylist Controller] getStylists error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching stylists.' });
  }
};

// GET /api/stylists/:id
const getStylistById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid stylist ID format.' });
    }

    const stylist = await Stylist.findById(id);
    if (!stylist) {
      return res.status(404).json({ success: false, message: 'Stylist not found.' });
    }

    return res.status(200).json({ success: true, data: stylist });
  } catch (error) {
    console.error('[Stylist Controller] getStylistById error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching stylist.' });
  }
};

// GET /api/stylists/:id/availability?date=YYYY-MM-DD
const getStylistAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter (YYYY-MM-DD) is required.' });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format.' });
    }

    const dayOfWeek = selectedDate.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, ...
    if (dayOfWeek === 1) {
      return res.status(400).json({ success: false, message: 'Salon is closed on Mondays.' });
    }

    // Generate slots
    const slots = [];
    const endHour = (dayOfWeek === 0) ? 18 : 20; // Sunday closes at 18:00

    for (let hour = 10; hour < endHour; hour++) {
      const hStr = hour < 10 ? `0${hour}` : `${hour}`;
      slots.push(`${hStr}:00`);
      slots.push(`${hStr}:30`);
    }

    // Query booked slots if valid ID
    let bookedSlots = [];
    if (id !== 'any' && mongoose.Types.ObjectId.isValid(id)) {
      const appointments = await Appointment.find({
        stylistId: id,
        date,
        status: { $ne: 'cancelled' }
      });
      bookedSlots = appointments.map(a => a.timeSlot);
    }

    const availability = slots.map(time => ({
      time,
      available: !bookedSlots.includes(time)
    }));

    return res.status(200).json({
      success: true,
      date,
      stylistId: id,
      data: availability
    });
  } catch (error) {
    console.error('[Stylist Controller] getStylistAvailability error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error checking slot availability.' });
  }
};

module.exports = {
  getStylists,
  getStylistById,
  getStylistAvailability
};
