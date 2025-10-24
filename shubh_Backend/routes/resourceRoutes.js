const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const resourceController = require('../controllers/resourceController');

// Temporarily make GET public for testing - REMOVE IN PRODUCTION
router.get('/', resourceController.listResources);

// Keep other routes protected
router.post('/', auth, admin, resourceController.createResource);
router.put('/:id', auth, admin, resourceController.updateResource);
router.delete('/:id', auth, admin, resourceController.deleteResource);

module.exports = router;
