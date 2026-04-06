const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notice = require('../models/Notice');
const { authenticate: auth } = require('../middleware/auth');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'notices');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

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

// POST /api/notices/upload — admin, multipart (notice + optional PDF)
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    const HOST = `${req.protocol}://${req.get('host')}`;
    const body = {
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'General',
      type: req.body.type || 'normal',
      status: req.body.status || 'published',
      hasAttachment: !!req.file,
      attachmentUrl: req.file ? `${HOST}/uploads/notices/${req.file.filename}` : '',
    };
    const notice = new Notice(body);
    const saved = await notice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/notices — admin, JSON body (no attachment)
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
    // Clean up physical PDF if it's a local upload
    if (deleted.attachmentUrl && deleted.attachmentUrl.includes('/uploads/notices/')) {
      const filename = deleted.attachmentUrl.split('/uploads/notices/')[1];
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
