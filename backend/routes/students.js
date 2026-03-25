const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { authenticate, authorize, teacherClassGuard } = require('../middleware/auth');

// POST /api/students — admin only
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, roll_number, class_id, parent_name, parent_phone, email, password } = req.body;
    if (!name || !roll_number || !class_id) {
      return res.status(400).json({ message: 'name, roll_number, class_id are required' });
    }
    const cls = await Class.findById(class_id);
    if (!cls) return res.status(400).json({ message: 'Class not found' });

    const data = { name, roll_number, class_id, parent_name, parent_phone, email };
    if (password) data.passwordHash = await bcrypt.hash(password, 10);

    const student = await Student.create(data);
    const { passwordHash: _, ...s } = student.toObject();
    res.status(201).json(s);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate roll number in this class or email already exists' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/students?class_id=... — admin gets all, teacher gets own class students
router.get('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    let filter = {};
    if (req.query.class_id) filter.class_id = req.query.class_id;

    // Teacher can only see students in their assigned classes
    if (req.user.role === 'teacher') {
      const assignedClasses = await Class.find({ class_teacher_id: req.user.id }).select('_id');
      const classIds = assignedClasses.map(c => c._id);
      if (req.query.class_id && !classIds.some(id => id.toString() === req.query.class_id)) {
        return res.status(403).json({ message: 'Not your assigned class' });
      }
      filter.class_id = { $in: classIds };
    }

    const students = await Student.find(filter).select('-passwordHash').populate('class_id', 'class_name section').sort({ roll_number: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', authenticate, authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const student = await Student.findById(req.params.id).select('-passwordHash').populate('class_id', 'class_name section');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
