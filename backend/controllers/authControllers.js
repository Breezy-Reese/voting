const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.register = async (req, res) => {
  const { username, password, fullName, ward, subcounty, county, idNumber } = req.body;
  console.log('Register request body:', req.body);

  // Validate required fields
  if (!username || !password || !fullName || !ward || !subcounty || !county || !idNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if username or idNumber already exists
    const existingUser = await User.findOne({ $or: [{ username }, { idNumber }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.idNumber === idNumber) {
        return res.status(400).json({ message: 'ID Number already exists' });
      }
    }

    const user = await User.create({ username, password, fullName, ward, subcounty, county, idNumber });
    const token = generateToken(user._id);
    res.status(201).json({ user: { id: user._id, username: user.username, role: user.role }, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: 'User registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ user: { id: user._id, username: user.username, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
