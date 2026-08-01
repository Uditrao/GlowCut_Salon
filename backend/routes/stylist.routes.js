const express = require('express');
const router = express.Router();
const { getStylists, getStylistById, getStylistAvailability } = require('../controllers/stylist.controller');

router.get('/', getStylists);
router.get('/:id', getStylistById);
router.get('/:id/availability', getStylistAvailability);

module.exports = router;
