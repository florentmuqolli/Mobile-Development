const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher'], default: 'student', required: true },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  handledAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
