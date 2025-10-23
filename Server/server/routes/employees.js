const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// ✅ Admin adds a new employee
router.post('/', async (req, res) => {
  try {
    const { name, employeeId, phone, department, password } = req.body;

    // Check all fields
    if (!name || !employeeId || !phone || !department || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Prevent duplicate employee ID
    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Create new employee
    const employee = new Employee({
      name,
      employeeId,
      phone,
      department,
      password, // Will be hashed automatically by model
    });

    await employee.save();
    res.status(201).json({ message: 'Employee added successfully', employee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee' });
  }
});

// ✅ Get all employees (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

module.exports = router;
