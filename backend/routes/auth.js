const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

// POST /api/auth/login — unified login for admin, teacher, student
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const loginRole = role || 'admin'; // default to admin for backward compat

    if (loginRole === 'admin') {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, admin.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken({ id: admin._id, email: admin.email, role: 'admin' });
      return res.json({ token, email: admin.email, role: 'admin' });
    }

    if (loginRole === 'teacher') {
      const teacher = await Teacher.findOne({ email });
      if (!teacher) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, teacher.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken({ id: teacher._id, email: teacher.email, role: 'teacher' });
      return res.json({ token, email: teacher.email, role: 'teacher', name: teacher.name });
    }

    if (loginRole === 'student') {
      const student = await Student.findOne({ email });
      if (!student) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, student.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken({ id: student._id, email: student.email, role: 'student', class_id: student.class_id });
      return res.json({ token, email: student.email, role: 'student', name: student.name });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
