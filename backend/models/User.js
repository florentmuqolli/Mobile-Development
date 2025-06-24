const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  profilePicture: { type: String },
  joinDate: { type: Date, default: Date.now },
  resetPasswordCode: String,       // Changed field name
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateResetCode = function () {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetPasswordCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetCode;
};

module.exports = mongoose.model('User', userSchema);
