const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');
const { authenticate: auth } = require('../middleware/auth');

// GET /api/gallery — public
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/gallery — admin
router.post('/', auth, async (req, res) => {
  try {
    const image = new GalleryImage(req.body);
    const saved = await image.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/gallery/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
