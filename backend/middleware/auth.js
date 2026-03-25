const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Unified auth middleware — decodes JWT and attaches user + role
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based access control — pass allowed roles as strings
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// Teacher-class access guard — ensures teacher can only access their assigned classes
const teacherClassGuard = (ClassModel) => {
  return async (req, res, next) => {
    if (req.user.role === 'admin') return next(); // admin bypasses
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access denied' });

    const classId = req.body.class_id || req.query.class_id || req.params.class_id;
    if (!classId) return next(); // no class context, let route handle it

    const cls = await ClassModel.findById(classId);
    if (!cls || cls.class_teacher_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not assigned to this class' });
    }
    next();
  };
};

module.exports = { authenticate, authorize, teacherClassGuard };
