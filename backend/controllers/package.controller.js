const Package = require('../models/Package');
const mongoose = require('mongoose');

// GET /api/packages
const getPackages = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };

    if (type) {
      filter.type = type;
    }

    const packages = await Package.find(filter).sort({ type: 1, discountedPrice: 1 });
    return res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error('[Package Controller] getPackages error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching packages.' });
  }
};

// GET /api/packages/:id
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid package ID format.' });
    }

    const pkg = await Package.findById(id);
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }

    return res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    console.error('[Package Controller] getPackageById error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching package.' });
  }
};

// POST /api/packages (Admin)
const createPackage = async (req, res) => {
  try {
    const { name, type, description, includedServices, originalPrice, discountedPrice, validityDays, badge } = req.body;

    if (!name || !type || !discountedPrice) {
      return res.status(400).json({ success: false, message: 'Please provide name, type, and discountedPrice.' });
    }

    const savingsAmount = (originalPrice || discountedPrice) - discountedPrice;

    const newPackage = await Package.create({
      name,
      type,
      description,
      includedServices: includedServices || [],
      originalPrice: originalPrice || discountedPrice,
      discountedPrice,
      savingsAmount: Math.max(0, savingsAmount),
      validityDays: validityDays || 30,
      badge,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: 'Package created successfully.',
      data: newPackage
    });
  } catch (error) {
    console.error('[Package Controller] createPackage error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating package.' });
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage
};
