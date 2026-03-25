const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  roll_number: { type: String, required: true, trim: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  parent_name: { type: String, trim: true },
  parent_phone: { type: String, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, default: 'student', immutable: true }
}, { timestamps: true });

studentSchema.index({ roll_number: 1, class_id: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
