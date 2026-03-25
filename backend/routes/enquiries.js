const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const auth = require('../middleware/auth');

// GET /api/enquiries — admin
router.get('/', auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/enquiries — public (contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, grade, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const enquiry = new Enquiry({ name, email, phone, grade, message });
    const saved = await enquiry.save();
    res.status(201).json({ message: 'Enquiry submitted successfully', id: saved._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/enquiries/:id — admin (update status)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/enquiries/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
