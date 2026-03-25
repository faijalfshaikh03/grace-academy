const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['event', 'news'], default: 'event' },
  date: { type: Date, required: true },
  time: { type: String, default: '' },
  location: { type: String, default: '' },
  image: { type: String, default: '' },
  excerpt: { type: String, required: true },
  category: {
    type: String,
    enum: ['Academic', 'Sports', 'Achievement', 'Cultural', 'Infrastructure', 'Workshop', 'General'],
    default: 'General'
  },
  author: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
