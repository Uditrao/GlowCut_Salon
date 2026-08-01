const express = require('express');
const router = express.Router();
const { createAppointment, getAppointmentById, cancelAppointment } = require('../controllers/appointment.controller');

router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.patch('/:id/cancel', cancelAppointment);

module.exports = router;
