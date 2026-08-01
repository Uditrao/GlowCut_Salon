const express = require('express');
const router = express.Router();
const { getQueueToday, advanceQueue, getTokenPosition } = require('../controllers/queue.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/today', getQueueToday);
router.patch('/advance', protect, adminOnly, advanceQueue);
router.get('/token/:tokenNumber', getTokenPosition);

module.exports = router;
