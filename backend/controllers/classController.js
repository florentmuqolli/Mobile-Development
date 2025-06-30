const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const ActivityLog = require('../models/ActivityLog');

exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await Class.getAll();
    res.json(rows);
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
