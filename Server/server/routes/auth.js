const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// =================== ADMIN ROUTES ===================

// Register Admin
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

    res.json({ message: 'Registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY || '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================== EMPLOYEE ROUTES ===================

// Employee Login
router.post('/employee-login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    if (!employeeId || !password)
      return res.status(400).json({ message: 'Employee ID and password required' });

    const employee = await Employee.findOne({ employeeId });
    if (!employee) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, employee.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: employee._id, role: 'employee' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY || '7d' }
    );

    res.json({ token, name: employee.name, employeeId: employee.employeeId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Employee Change Password
router.put('/employee/change-password', async (req, res) => {
  try {
    const { employeeId, oldPassword, newPassword } = req.body;

    if (!employeeId || !oldPassword || !newPassword)
      return res.status(400).json({ message: 'All fields are required' });

    const employee = await Employee.findOne({ employeeId });
    if (!employee)
      return res.status(404).json({ message: 'Employee not found' });

    const isMatch = await bcrypt.compare(oldPassword, employee.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect old password' });

    const salt = await bcrypt.genSalt(10);
    employee.passwordHash = await bcrypt.hash(newPassword, salt);
    await employee.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
