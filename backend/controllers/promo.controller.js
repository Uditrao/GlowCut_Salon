const PromoCode = require('../models/PromoCode');

// POST /api/promo/validate
const validatePromoCode = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a promo code.' });
    }

    const codeUpper = code.trim().toUpperCase();
    const promo = await PromoCode.findOne({ code: codeUpper, isActive: true });

    if (!promo) {
      return res.status(400).json({ success: false, message: 'Invalid promo code.' });
    }

    const now = new Date();
    if (now > promo.expiryDate) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    if (promo.usedCount >= promo.maxUsageCount) {
      return res.status(400).json({ success: false, message: 'This promo code limit has been reached.' });
    }

    const val = orderValue ? Number(orderValue) : 0;
    if (val < promo.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for this code is ₹${promo.minOrderValue}.`
      });
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((val * promo.discountValue) / 100);
    } else {
      discountAmount = promo.discountValue;
    }

    const finalPrice = Math.max(0, val - discountAmount);

    return res.status(200).json({
      success: true,
      valid: true,
      message: 'Promo code applied successfully!',
      code: promo.code,
      discountAmount,
      finalPrice,
      description: promo.description
    });
  } catch (error) {
    console.error('[Promo Controller] validatePromoCode error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error validating promo code.' });
  }
};

// GET /api/admin/promos (Admin)
const getAdminPromos = async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: promos.length, data: promos });
  } catch (error) {
    console.error('[Promo Controller] getAdminPromos error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching promos.' });
  }
};

// POST /api/admin/promos (Admin)
const createPromoCode = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, expiryDate, maxUsageCount, description } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Please provide code, discountType, discountValue, and expiryDate.' });
    }

    const existing = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A promo code with this name already exists.' });
    }

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      expiryDate,
      maxUsageCount: maxUsageCount || 100,
      description,
      isActive: true
    });

    return res.status(201).json({ success: true, message: 'Promo code created.', data: promo });
  } catch (error) {
    console.error('[Promo Controller] createPromoCode error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating promo code.' });
  }
};

module.exports = {
  validatePromoCode,
  getAdminPromos,
  createPromoCode
};
