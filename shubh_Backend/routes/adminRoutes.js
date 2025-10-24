const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// Temporarily make seed public for testing - REMOVE IN PRODUCTION
router.post('/seed', adminController.seedMockData);

// Protected admin endpoints
router.get('/dashboard', auth, admin, adminController.getDashboard);

module.exports = router;
