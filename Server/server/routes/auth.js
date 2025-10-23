const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash });
    await user.save();
    // After register, we won't auto-login; frontend will navigate to login.
    res.json({ message: 'Registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Employee login
router.post('/employee-login', async (req, res) => {
try {
const { employeeId, password } = req.body;
const employee = await Employee.findOne({ employeeId });
if (!employee) return res.status(400).json({ message: 'Invalid credentials' });

const match = await bcrypt.compare(password, employee.password);
if (!match) return res.status(400).json({ message: 'Invalid credentials' });

const token = jwt.sign(
{ id: employee._id, role: 'employee' },
process.env.JWT_SECRET,
{ expiresIn: process.env.TOKEN_EXPIRY ||


module.exports = router;
