const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

// Define your office coordinates
const OFFICE_LAT = 12.997177;  // example: Bangalore latitude
const OFFICE_LON = 77.660501;  // example: Bangalore longitude
const ALLOWED_RADIUS_METERS = 50; // radius for marking attendance

// Utility: Haversine formula to calculate distance between two GPS coordinates
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of Earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /api/attendance/mark
router.post('/mark', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location access required' });
    }

    // Calculate distance from office
    const distance = getDistanceFromLatLonInMeters(
      OFFICE_LAT,
      OFFICE_LON,
      latitude,
      longitude
    );

    if (distance > ALLOWED_RADIUS_METERS) {
      return res.status(403).json({
        message: `You are outside the allowed area (${Math.round(distance)}m away from office).`,
      });
    }

    const employeeId = req.user.id; // From JWT
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent duplicate marking
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked today' });
    }

    const attendance = new Attendance({
      employee: employeeId,
      date: today,
      status: 'present',
      createdBy: req.user.id,
    });
    await attendance.save();

    res.json({ message: 'Attendance marked successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
