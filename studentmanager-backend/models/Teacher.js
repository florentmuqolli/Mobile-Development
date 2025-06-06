const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  subject: { type: String },
  department: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
