const Assignment = require('../models/Assignment');

exports.getAllAssignments = async (req, res) => {
  try {
    const [rows] = await Assignment.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const [rows] = await Assignment.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { class_id, title, description, due_date } = req.body;
    const [result] = await Assignment.create({ class_id, title, description, due_date });
    res.status(201).json({ id: result.insertId, class_id, title, description, due_date });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { class_id, title, description, due_date } = req.body;
    const [result] = await Assignment.update(req.params.id, {
      class_id,
      title,
      description,
      due_date,
    });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const [result] = await Assignment.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
