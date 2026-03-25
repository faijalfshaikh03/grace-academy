const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/progress — teacher or admin
router.post('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { student_id, subject, marks, rating, remarks, performance_status, date } = req.body;
    if (!student_id || !subject || !performance_status) {
      return res.status(400).json({ message: 'student_id, subject, performance_status are required' });
    }

    // Verify teacher has access to student's class
    if (req.user.role === 'teacher') {
      const student = await Student.findById(student_id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      const cls = await Class.findById(student.class_id);
      if (!cls || cls.class_teacher_id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Student is not in your assigned class' });
      }
    }

    const progress = await Progress.create({
      student_id,
      teacher_id: req.user.role === 'teacher' ? req.user.id : req.body.teacher_id,
      subject, marks, rating, remarks, performance_status,
      date: date || Date.now()
    });
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/progress?student_id=...
router.get('/', authenticate, authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    const { student_id } = req.query;
    if (!student_id && req.user.role === 'student') {
      req.query.student_id = req.user.id;
    }
    if (!req.query.student_id) return res.status(400).json({ message: 'student_id is required' });

    // Student can only see own progress
    if (req.user.role === 'student' && req.user.id !== req.query.student_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Teacher can only see progress of students in their class
    if (req.user.role === 'teacher') {
      const student = await Student.findById(req.query.student_id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      const cls = await Class.findById(student.class_id);
      if (!cls || cls.class_teacher_id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Student is not in your assigned class' });
      }
    }

    const progress = await Progress.find({ student_id: req.query.student_id })
      .populate('teacher_id', 'name subject')
      .populate('student_id', 'name roll_number')
      .sort({ date: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
