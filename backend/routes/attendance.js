const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { authenticate, authorize, teacherClassGuard } = require('../middleware/auth');

// POST /api/attendance — bulk insert for a class (admin or assigned teacher)
router.post('/', authenticate, authorize('admin', 'teacher'), teacherClassGuard(Class), async (req, res) => {
  try {
    const { class_id, date, records } = req.body;
    // records = [{ student_id, status }]
    if (!class_id || !date || !Array.isArray(records) || !records.length) {
      return res.status(400).json({ message: 'class_id, date, and records[] are required' });
    }
    const cls = await Class.findById(class_id);
    if (!cls) return res.status(400).json({ message: 'Class not found' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const ops = records.map(r => ({
      updateOne: {
        filter: { student_id: r.student_id, date: attendanceDate },
        update: { $set: { student_id: r.student_id, class_id, date: attendanceDate, status: r.status } },
        upsert: true
      }
    }));

    const result = await Attendance.bulkWrite(ops);
    res.status(201).json({ message: `Attendance marked for ${records.length} students`, result: { upserted: result.upsertedCount, modified: result.modifiedCount } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/attendance?class_id=...&date=... or ?student_id=...
router.get('/', authenticate, authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    const { class_id, date, student_id } = req.query;
    let filter = {};

    if (student_id) {
      // Student can only see their own
      if (req.user.role === 'student' && req.user.id !== student_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      filter.student_id = student_id;
    } else if (class_id) {
      // Teacher can only see their assigned class
      if (req.user.role === 'teacher') {
        const cls = await Class.findById(class_id);
        if (!cls || cls.class_teacher_id.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Not your assigned class' });
        }
      }
      filter.class_id = class_id;
      if (date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        filter.date = d;
      }
    } else if (req.user.role === 'student') {
      filter.student_id = req.user.id;
    } else {
      return res.status(400).json({ message: 'Provide class_id or student_id' });
    }

    const attendance = await Attendance.find(filter)
      .populate('student_id', 'name roll_number')
      .populate('class_id', 'class_name section')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
