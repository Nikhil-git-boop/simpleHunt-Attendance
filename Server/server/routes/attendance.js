const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// mark attendance
router.post('/mark', auth, async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    if (!employeeId || !date || !status) return res.status(400).json({ message: 'Missing fields' });
    const d = new Date(date);
    // Normalize date to midnight UTC for uniqueness
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // Upsert should be prevented if exists; we want to disallow changes if already marked
    const exists = await Attendance.findOne({ employee: mongoose.Types.ObjectId(employeeId), date: dayStart });
    if (exists) return res.status(400).json({ message: 'Already marked for this date' });
    const rec = new Attendance({ employee: employeeId, date: dayStart, status, createdBy: req.user.id });
    await rec.save();
    res.json({ message: 'Marked', attendance: rec });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get monthly stats for an employee
router.get('/stats', auth, async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    if (!employeeId || !month || !year) return res.status(400).json({ message: 'employeeId, month & year required' });

    const m = parseInt(month, 10) - 1; // month 0-11
    const y = parseInt(year, 10);
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const agg = await Attendance.aggregate([
      { $match: { employee: mongoose.Types.ObjectId(employeeId), date: { $gte: start, $lt: end } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = { present: 0, absent: 0 };
    agg.forEach(x => {
      if (x._id === 'present') result.present = x.count;
      if (x._id === 'absent') result.absent = x.count;
    });

    res.json({ month: month, year: year, totals: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
