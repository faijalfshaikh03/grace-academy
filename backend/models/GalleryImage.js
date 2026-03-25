const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Academics', 'Sports', 'Cultural', 'Infrastructure', 'Activities', 'Events'],
    default: 'Events'
  },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
