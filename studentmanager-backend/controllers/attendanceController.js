const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: 'Failed to mark attendance', details: err.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('student', 'name')
      .populate('class', 'name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance', details: err.message });
  }
};

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId })
      .populate('class', 'name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student attendance', details: err.message });
  }
};
