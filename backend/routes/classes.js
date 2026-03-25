const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/classes — admin only
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { class_name, section, class_teacher_id } = req.body;
    if (!class_name || !section || !class_teacher_id) {
      return res.status(400).json({ message: 'class_name, section, class_teacher_id are required' });
    }
    const teacher = await Teacher.findById(class_teacher_id);
    if (!teacher) return res.status(400).json({ message: 'Teacher not found' });

    const cls = await Class.create({ class_name, section, class_teacher_id });
    res.status(201).json(cls);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Class with this name and section already exists' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/classes — admin gets all, teacher gets assigned
router.get('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const filter = req.user.role === 'teacher' ? { class_teacher_id: req.user.id } : {};
    const classes = await Class.find(filter).populate('class_teacher_id', 'name email subject').sort({ class_name: 1, section: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/classes/:id
router.get('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate('class_teacher_id', 'name email subject');
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    if (req.user.role === 'teacher' && cls.class_teacher_id._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your assigned class' });
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/classes/:id — admin only
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { class_name, section, class_teacher_id } = req.body;
    const update = {};
    if (class_name) update.class_name = class_name;
    if (section) update.section = section;
    if (class_teacher_id) {
      const teacher = await Teacher.findById(class_teacher_id);
      if (!teacher) return res.status(400).json({ message: 'Teacher not found' });
      update.class_teacher_id = class_teacher_id;
    }
    const cls = await Class.findByIdAndUpdate(req.params.id, update, { new: true }).populate('class_teacher_id', 'name email subject');
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/classes/:id — admin only
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
