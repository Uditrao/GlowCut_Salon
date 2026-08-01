const Review = require('../models/Review');
const mongoose = require('mongoose');

// GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const { rating, sort, page = 1, limit = 10 } = req.query;
    const queryFilter = { isApproved: true };

    if (rating && !isNaN(rating)) {
      queryFilter.rating = Number(rating);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'highest') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === 'lowest') {
      sortOption = { rating: 1, createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Review.countDocuments(queryFilter);
    const reviews = await Review.find(queryFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('[Review Controller] getReviews error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching reviews.' });
  }
};

// GET /api/reviews/summary
const getReviewSummary = async (req, res) => {
  try {
    const approvedReviews = await Review.find({ isApproved: true }).select('rating');
    const total = approvedReviews.length;

    if (total === 0) {
      return res.status(200).json({
        success: true,
        data: {
          average: 4.8,
          total: 0,
          breakdown: {
            5: { count: 0, percentage: 0 },
            4: { count: 0, percentage: 0 },
            3: { count: 0, percentage: 0 },
            2: { count: 0, percentage: 0 },
            1: { count: 0, percentage: 0 }
          }
        }
      });
    }

    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach(r => {
      const star = Math.round(r.rating);
      if (breakdown[star] !== undefined) {
        breakdown[star]++;
      }
    });

    const formattedBreakdown = {};
    for (let i = 1; i <= 5; i++) {
      const count = breakdown[i] || 0;
      formattedBreakdown[i] = {
        count,
        percentage: Math.round((count / total) * 100)
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        average: parseFloat(average),
        total,
        breakdown: formattedBreakdown
      }
    });
  } catch (error) {
    console.error('[Review Controller] getReviewSummary error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching review summary.' });
  }
};

// POST /api/reviews
const submitReview = async (req, res) => {
  try {
    const { customerName, rating, comment, serviceAvailed } = req.body;

    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide customerName, rating, and comment.' });
    }

    if (comment.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Review comment must be at least 10 characters long.' });
    }

    const review = await Review.create({
      customerName,
      rating: Number(rating),
      comment: comment.trim(),
      serviceAvailed: serviceAvailed || 'General Service',
      isApproved: false // Admin approval required
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and is pending approval.',
      data: review
    });
  } catch (error) {
    console.error('[Review Controller] submitReview error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error submitting review.' });
  }
};

// GET /api/admin/reviews/pending (Admin)
const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('[Review Controller] getPendingReviews error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching pending reviews.' });
  }
};

// PATCH /api/admin/reviews/:id/approve (Admin)
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID format.' });
    }

    const review = await Review.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    return res.status(200).json({ success: true, message: 'Review approved successfully.', data: review });
  } catch (error) {
    console.error('[Review Controller] approveReview error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error approving review.' });
  }
};

// DELETE /api/admin/reviews/:id (Admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID format.' });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    return res.status(200).json({ success: true, message: 'Review removed successfully.' });
  } catch (error) {
    console.error('[Review Controller] deleteReview error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting review.' });
  }
};

module.exports = {
  getReviews,
  getReviewSummary,
  submitReview,
  getPendingReviews,
  approveReview,
  deleteReview
};
