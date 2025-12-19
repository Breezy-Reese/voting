const express = require('express');
const { getSystemHealth } = require('../controllers/healthController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Health check endpoint - accessible to admins only
router.get('/', authMiddleware, roleMiddleware('admin'), getSystemHealth);

module.exports = router;
