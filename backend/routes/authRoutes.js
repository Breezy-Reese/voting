const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserCount, getMe, getUserRoleCounts } = require('../controllers/authControllers');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.get('/users/count', authMiddleware, roleMiddleware('admin'), getUserCount);
router.get('/users/role-counts', authMiddleware, roleMiddleware('admin'), getUserRoleCounts);

// Diagnostic endpoint to check admin user
router.get('/debug/admin-check', async (req, res) => {
  try {
    const adminUser = await User.findOne({ username: 'basil mutuku' });
    if (!adminUser) {
      return res.json({ found: false, message: 'Admin user not found' });
    }
    res.json({
      found: true,
      username: adminUser.username,
      role: adminUser.role,
      _id: adminUser._id,
      fullName: adminUser.fullName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
