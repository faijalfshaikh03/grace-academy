const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'teacher', immutable: true }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
