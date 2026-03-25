const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/events', require('./routes/events'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/gallery', require('./routes/gallery'));

// Health check
app.get('/', (req, res) => res.json({ message: 'GA School API is running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Connect to MongoDB and seed admin
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    await seedAdmin();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  const Admin = require('./models/Admin');
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL, passwordHash: hash });
    console.log('✅ Admin seeded:', process.env.ADMIN_EMAIL);
  }
};

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
