const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
const ActivityLog = require('../models/ActivityLog');

exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await Class.getAll();
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const userIds = rows
      .filter(row => row.teacher_user_id) 
      .map(row => row.teacher_user_id);

    const uniqueUserIds = [...new Set(userIds)];

    const users = await User.find({ _id: { $in: uniqueUserIds } }).select('_id name');

    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user.name;
    });

    const enrichedRows = rows.map(row => ({
      ...row,
      teacher_name: row.teacher_user_id ? userMap[row.teacher_user_id] || 'Unknown' : 'Unknown',
    }));

    res.json(enrichedRows);
  } catch (error) {
    console.error('Error getting classes: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const [rows] = await Class.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Class not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting class by id: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getClassByTeacher = async (req, res) => {
  try {
    const userId = req.user?.id;
    const teacher = await Teacher.getByUserId(userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const teacherId = teacher.id;
    const [rows] = await Class.getByTeacherId(teacherId);
    if (rows.length === 0) return res.status(404).json({ message: 'Class not found' });
    res.json(rows);
  } catch (error) {
    console.error('Error getting class by teacher: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getClassByStudent = async (req, res) => {
  try {
    const userId = req.user?.id;

    const student = await Student.getByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = student.id;
    const [rows] = await Class.getByStudentId(studentId);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const userIds = rows
      .filter(row => row.teacher_user_id) 
      .map(row => row.teacher_user_id);

    const uniqueUserIds = [...new Set(userIds)];

    const users = await User.find({ _id: { $in: uniqueUserIds } }).select('_id name');

    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user.name;
    });

    const enrichedRows = rows.map(row => ({
      ...row,
      teacher_name: row.teacher_user_id ? userMap[row.teacher_user_id] || 'Unknown' : 'Unknown',
    }));

    res.json(enrichedRows);

  } catch (error) {
    console.error('Error getting class by student: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { title, description, teacher_id, schedule, day, room, status } = req.body;
    const [result] = await Class.create({ title, description, teacher_id, schedule, day, room, status });
    await ActivityLog.create(req.user.name, 'added a new course', '📚');
    res.status(201).json({ id: result.insertId, title, description, teacher_id, schedule, day, room, status });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { title, description, teacher_id, schedule, day, room, status } = req.body;
    const [result] = await Class.update(req.params.id, {
      title,
      description,
      teacher_id,
      schedule,
      day,
      room,
      status
    });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Class not found' });
    await ActivityLog.create(req.user.name, 'updated a course', '📚');
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    console.error('Error updating class: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const [result] = await Class.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Class not found' });
    await ActivityLog.create(req.user.name, 'deleted a course', '📚');
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
