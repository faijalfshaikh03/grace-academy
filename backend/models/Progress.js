const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  subject: { type: String, required: true, trim: true },
  marks: { type: Number, min: 0, max: 100 },
  rating: { type: Number, min: 1, max: 5 },
  remarks: { type: String, trim: true },
  performance_status: { type: String, enum: ['Good', 'Average', 'Needs Improvement'], required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

progressSchema.index({ student_id: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
