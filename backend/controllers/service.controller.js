const Service = require('../models/Service');
const mongoose = require('mongoose');

// GET /api/services
const getServices = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('[Service Controller] getServices error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching services.' });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID format.' });
    }

    const service = await Service.findById(id);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error('[Service Controller] getServiceById error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching service details.' });
  }
};

// POST /api/services (Admin)
const createService = async (req, res) => {
  try {
    const { name, category, description, price, durationMinutes, imageUrl } = req.body;

    if (!name || !category || !price || !durationMinutes) {
      return res.status(400).json({ success: false, message: 'Please provide name, category, price, and durationMinutes.' });
    }

    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({ success: false, message: 'A service with this name already exists.' });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price,
      durationMinutes,
      imageUrl: imageUrl || '/assets/images/service-placeholder.jpg',
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: service
    });
  } catch (error) {
    console.error('[Service Controller] createService error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating service.' });
  }
};

// PATCH /api/services/:id (Admin)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID format.' });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: updatedService
    });
  } catch (error) {
    console.error('[Service Controller] updateService error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating service.' });
  }
};

// DELETE /api/services/:id (Admin Soft Delete)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID format.' });
    }

    const service = await Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Service deactivated successfully.'
    });
  } catch (error) {
    console.error('[Service Controller] deleteService error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deactivating service.' });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
