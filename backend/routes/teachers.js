const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/teachers — admin only
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, subject, password } = req.body;
    if (!name || !email || !subject || !password) {
      return res.status(400).json({ message: 'name, email, subject, password are required' });
    }
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Teacher with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const teacher = await Teacher.create({ name, email, phone, subject, passwordHash });
    const { passwordHash: _, ...t } = teacher.toObject();
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/teachers — admin gets all, teacher gets own profile
router.get('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findById(req.user.id).select('-passwordHash');
      return res.json(teacher ? [teacher] : []);
    }
    const teachers = await Teacher.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/teachers/:id — admin or the teacher themselves
router.get('/:id', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    if (req.user.role === 'teacher' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const teacher = await Teacher.findById(req.params.id).select('-passwordHash');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/teachers/:id — admin only
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, subject, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone !== undefined) update.phone = phone;
    if (subject) update.subject = subject;
    if (password) update.passwordHash = await bcrypt.hash(password, 10);
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/teachers/:id — admin only
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
