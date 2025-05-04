const Class = require('../models/Class');

exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create class', details: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher', 'username role');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes', details: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('teacher', 'username role');
    if (!classItem) return res.status(404).json({ error: 'Class not found' });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch class', details: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Class not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update class', details: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete class', details: err.message });
  }
};
