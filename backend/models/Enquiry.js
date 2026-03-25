const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  grade: { type: String, default: '' },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'pending', 'closed'],
    default: 'new'
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
