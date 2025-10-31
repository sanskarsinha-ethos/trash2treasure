// server.js

// --- Core Imports ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Custom Imports ---
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // <-- You needed this

// --- Configuration ---
dotenv.config();
connectDB(); // Connect to MongoDB

// --- App Initialization ---
const app = express();

// --- Core Middlewares ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- API Routes ---
// Tell Express to use your route files
app.use('/api/users', userRoutes);
app.Wuse('/api/uploads', uploadRoutes); // <-- You needed this

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});