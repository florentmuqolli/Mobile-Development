const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: { type: String },
  room: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // assuming teachers are stored in User model
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
