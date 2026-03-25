const express = require('express');
const router = express.Router();
const Homework = require('../models/Homework');
const Class = require('../models/Class');
const Student = require('../models/Student');
const { authenticate, authorize, teacherClassGuard } = require('../middleware/auth');

// POST /api/homework — teacher or admin
router.post('/', authenticate, authorize('admin', 'teacher'), teacherClassGuard(Class), async (req, res) => {
  try {
    const { class_id, title, description, file_url, due_date } = req.body;
    if (!class_id || !title || !due_date) {
      return res.status(400).json({ message: 'class_id, title, due_date are required' });
    }
    const cls = await Class.findById(class_id);
    if (!cls) return res.status(400).json({ message: 'Class not found' });

    const homework = await Homework.create({
      class_id,
      teacher_id: req.user.role === 'teacher' ? req.user.id : req.body.teacher_id,
      title, description, file_url, due_date
    });
    res.status(201).json(homework);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/homework?class_id=...
router.get('/', authenticate, authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    let filter = {};

    if (req.query.class_id) {
      filter.class_id = req.query.class_id;
    } else if (req.user.role === 'student') {
      // Student auto-gets homework for their class
      const student = await Student.findById(req.user.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      filter.class_id = student.class_id;
    } else if (req.user.role === 'teacher') {
      // Teacher gets homework for all their assigned classes
      const classes = await Class.find({ class_teacher_id: req.user.id }).select('_id');
      filter.class_id = { $in: classes.map(c => c._id) };
    }

    // Teacher-class access check
    if (req.user.role === 'teacher' && req.query.class_id) {
      const cls = await Class.findById(req.query.class_id);
      if (!cls || cls.class_teacher_id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not your assigned class' });
      }
    }

    const homework = await Homework.find(filter)
      .populate('class_id', 'class_name section')
      .populate('teacher_id', 'name subject')
      .sort({ due_date: -1 });
    res.json(homework);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
