// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// We need to load dotenv here too
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Connection failed: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;