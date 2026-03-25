const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['Examination', 'Meeting', 'Activity', 'Holiday', 'Admission', 'General'],
    default: 'General'
  },
  type: {
    type: String,
    enum: ['urgent', 'important', 'normal'],
    default: 'normal'
  },
  hasAttachment: { type: Boolean, default: false },
  attachmentUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
