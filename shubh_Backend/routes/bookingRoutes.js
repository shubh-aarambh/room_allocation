const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const bookingController = require('../controllers/bookingController');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.listBookings);

// Generic update route for admin to change status
router.put('/:id', auth, admin, bookingController.updateBookingStatus);

// Keep these as alternatives
router.put('/:id/approve', auth, admin, bookingController.approveBooking);
router.put('/:id/reject', auth, admin, bookingController.rejectBooking);

module.exports = router;
