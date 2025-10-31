// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
});

// This Mongoose middleware runs *before* a user is saved
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document being saved
  
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  T}
  
  try {
    // Generate a 'salt' - a random string to make the hash unique
    const salt = await bcrypt.genSalt(10); 
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// This adds a method to the user model to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the database
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;