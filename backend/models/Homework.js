const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  file_url: { type: String, trim: true },
  due_date: { type: Date, required: true }
}, { timestamps: true });

homeworkSchema.index({ class_id: 1, due_date: -1 });

module.exports = mongoose.model('Homework', homeworkSchema);
