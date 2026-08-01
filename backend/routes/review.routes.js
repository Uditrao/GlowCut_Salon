const express = require('express');
const router = express.Router();
const { getReviews, getReviewSummary, submitReview } = require('../controllers/review.controller');

router.get('/', getReviews);
router.get('/summary', getReviewSummary);
router.post('/', submitReview);

module.exports = router;
