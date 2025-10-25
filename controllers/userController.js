// controllers/userController.js
const User = require('../models/userModel'); // Import the model
const jwt = require('jsonwebtoken');

// Helper function to create a token
// It takes the user's ID as the payload
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create new user
    // The password will be automatically hashed by the 'pre-save' hook in the model
    const user = await User.create({
      username,
      email,
      password,
    });

    // 3. If user created successfully, send back user data and a token
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND if the password matches
    // We use the 'matchPassword' method we created in the model
    if (user && (await user.matchPassword(password))) {
      // 3. Send back user data and a new token
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
};