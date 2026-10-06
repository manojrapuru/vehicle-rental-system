const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking endpoints
router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
