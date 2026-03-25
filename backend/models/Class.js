const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class_name: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true, uppercase: true },
  class_teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: true });

classSchema.index({ class_name: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
