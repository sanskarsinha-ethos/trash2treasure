// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// When a POST request comes to /api/users/register, run the registerUser function
router.post('/register', registerUser);

// When a POST request comes to /api/users/login, run the loginUser function
router.post('/login', loginUser);

// You can add more routes here, like getting a user profile
// router.get('/profile', protect, getUserProfile); // 'protect' is middleware

module.exports = router;