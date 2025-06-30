const Attendance = require('../models/Attendance'); 
const Teacher = require('../models/Teacher'); 
const User = require('../models/User'); 

exports.getAttendanceByCourse = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { date } = req.query;

    const [rows] = await Attendance.getByCourse(class_id, date);

    const userIds = rows.map(row => row.user_id);
    const mongoUsers = await User.find({ _id: { $in: userIds } }, 'name');

    const userIdToName = {};
    mongoUsers.forEach(user => {
      userIdToName[user._id.toString()] = user.name;
    });

    const enrichedRows = rows.map(row => ({
      ...row,
      student_name: userIdToName[row.user_id] || 'Unknown'
    }));

    res.status(200).json(enrichedRows);
  } catch (err) {
    console.error('Get attendance by course error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceSummaryByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const [rows] = await Attendance.getSummaryByStudent(student_id);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get student attendance summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceSummaryByTeacher = async (req, res) => {
  try {
    const userId = req.user?.id;

    const teacher = await Teacher.getByUserId(userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const teacherId = teacher.id;
    const [rows] = await Attendance.getSummaryByTeacher(teacherId);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Get teacher attendance summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { class_id, date, students } = req.body;

    if (!class_id || !date || !Array.isArray(students)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    for (const entry of students) {
      await Attendance.mark({
        class_id,
        student_id: entry.student_id,
        status: entry.status,
        date,
      });
    }

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error('Mark attendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};