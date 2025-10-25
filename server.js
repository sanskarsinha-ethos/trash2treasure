// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import your routes file ---
const userRoutes = require('./routes/userRoutes'); 

dotenv.config();
connectDB(); 

const app = express();

app.use(cors());
app.use(express.json()); // This is crucial! It parses req.body

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Tell Express to use the routes ---
// Any URL starting with /api/users will be handled by 'userRoutes'
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});