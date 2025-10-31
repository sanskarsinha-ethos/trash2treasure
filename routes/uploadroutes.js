// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { getSignedS3Url } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware'); // Import your auth middleware

// This route is protected. Only logged-in users can get a URL.
router.post('/get-signed-url', protect, getSignedS3Url);

module.exports = router;