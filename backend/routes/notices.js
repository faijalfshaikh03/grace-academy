const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { authenticate: auth } = require('../middleware/auth');

// GET /api/notices — public
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ status: 'published' }).sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notices/all — admin: includes drafts
router.get('/all', auth, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notices — admin
router.post('/', auth, async (req, res) => {
  try {
    const notice = new Notice(req.body);
    const saved = await notice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/notices/:id — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Notice not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/notices/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
