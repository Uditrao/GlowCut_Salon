const Queue = require('../models/Queue');
const Appointment = require('../models/Appointment');

const getTodayDateString = () => new Date().toISOString().split('T')[0];

// GET /api/queue/today
const getQueueToday = async (req, res) => {
  try {
    const today = getTodayDateString();
    let queue = await Queue.findOne({ date: today }).populate({
      path: 'queueList',
      populate: [
        { path: 'serviceId', select: 'name category price durationMinutes' },
        { path: 'stylistId', select: 'name photo' }
      ]
    });

    if (!queue) {
      return res.status(200).json({
        success: true,
        message: 'Queue is currently empty for today.',
        data: {
          date: today,
          currentTokenBeingServed: null,
          totalTokensIssued: 0,
          peopleWaitingCount: 0,
          averageWaitMinutes: 0,
          queueList: []
        }
      });
    }

    // Filter active items in queue
    const activeQueueItems = queue.queueList.filter(item => item && item.status !== 'cancelled');
    const waitingItems = activeQueueItems.filter(item => item.status === 'confirmed' || item.status === 'in-progress');

    // Calculate queue positions & estimated wait
    const formattedQueueList = activeQueueItems.map((item, index) => {
      const position = index + 1;
      const estimatedWaitMinutes = Math.max(0, (position - 1) * queue.averageServiceDurationMinutes);
      return {
        _id: item._id,
        tokenNumber: item.tokenNumber,
        customerName: item.customerName,
        serviceName: item.serviceId ? item.serviceId.name : 'Salon Service',
        stylistName: item.stylistId ? item.stylistId.name : 'Stylist',
        status: item.status,
        timeSlot: item.timeSlot,
        position,
        estimatedWaitMinutes
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        date: queue.date,
        currentTokenBeingServed: queue.currentTokenBeingServed,
        totalTokensIssued: queue.totalTokensIssued,
        peopleWaitingCount: waitingItems.length,
        averageServiceDurationMinutes: queue.averageServiceDurationMinutes,
        queueList: formattedQueueList
      }
    });
  } catch (error) {
    console.error('[Queue Controller] getQueueToday error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching today queue.' });
  }
};

// PATCH /api/queue/advance (Admin)
const advanceQueue = async (req, res) => {
  try {
    const today = getTodayDateString();
    let queue = await Queue.findOne({ date: today }).populate('queueList');

    if (!queue || !queue.queueList || queue.queueList.length === 0) {
      return res.status(400).json({ success: false, message: 'Queue is empty. No tokens to advance.' });
    }

    // Find in-progress or currently served appointment
    const currentApptIndex = queue.queueList.findIndex(
      a => a.tokenNumber === queue.currentTokenBeingServed || a.status === 'in-progress'
    );

    if (currentApptIndex !== -1) {
      const currentAppt = queue.queueList[currentApptIndex];
      await Appointment.findByIdAndUpdate(currentAppt._id, { status: 'completed' });
    }

    // Find next appointment in queue that is 'confirmed'
    const nextAppt = queue.queueList.find(
      a => a.status === 'confirmed'
    );

    if (nextAppt) {
      await Appointment.findByIdAndUpdate(nextAppt._id, { status: 'in-progress' });
      queue.currentTokenBeingServed = nextAppt.tokenNumber;
    } else {
      queue.currentTokenBeingServed = null; // No more waiting tokens
    }

    await queue.save();

    return res.status(200).json({
      success: true,
      message: queue.currentTokenBeingServed ? `Advanced to Token ${queue.currentTokenBeingServed}` : 'All tokens completed!',
      currentTokenBeingServed: queue.currentTokenBeingServed
    });
  } catch (error) {
    console.error('[Queue Controller] advanceQueue error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error advancing queue.' });
  }
};

// GET /api/queue/token/:tokenNumber
const getTokenPosition = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const appointment = await Appointment.findOne({ tokenNumber: tokenNumber.toUpperCase() })
      .populate('serviceId', 'name price durationMinutes')
      .populate('stylistId', 'name photo');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Token number not found.' });
    }

    const queue = await Queue.findOne({ date: appointment.date }).populate('queueList');
    if (!queue) {
      return res.status(200).json({
        success: true,
        data: {
          tokenNumber: appointment.tokenNumber,
          customerName: appointment.customerName,
          status: appointment.status,
          positionInQueue: 0,
          peopleAhead: 0,
          estimatedWaitMinutes: 0
        }
      });
    }

    const activeList = queue.queueList.filter(a => a && a.status !== 'cancelled' && a.status !== 'completed');
    const index = activeList.findIndex(a => a.tokenNumber === appointment.tokenNumber);

    const positionInQueue = index !== -1 ? index + 1 : 0;
    const peopleAhead = Math.max(0, positionInQueue - 1);
    const estimatedWaitMinutes = peopleAhead * (queue.averageServiceDurationMinutes || 35);

    return res.status(200).json({
      success: true,
      data: {
        tokenNumber: appointment.tokenNumber,
        customerName: appointment.customerName,
        serviceName: appointment.serviceId ? appointment.serviceId.name : 'Service',
        stylistName: appointment.stylistId ? appointment.stylistId.name : 'Stylist',
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
        currentTokenBeingServed: queue.currentTokenBeingServed,
        positionInQueue,
        peopleAhead,
        estimatedWaitMinutes
      }
    });
  } catch (error) {
    console.error('[Queue Controller] getTokenPosition error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error looking up token.' });
  }
};

module.exports = {
  getQueueToday,
  advanceQueue,
  getTokenPosition
};
