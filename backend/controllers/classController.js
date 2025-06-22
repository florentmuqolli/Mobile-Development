const Class = require('../models/Class');

exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await Class.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const [rows] = await Class.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Class not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { title, description, teacher_id, schedule, room } = req.body;
    const [result] = await Class.create({ title, description, teacher_id, schedule, room });
    res.status(201).json({ id: result.insertId, title, description, teacher_id, schedule, room });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { title, description, teacher_id, schedule, room } = req.body;
    const [result] = await Class.update(req.params.id, {
      title,
      description,
      teacher_id,
      schedule,
      room,
    });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const [result] = await Class.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
