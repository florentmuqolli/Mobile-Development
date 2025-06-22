const Enrollment = require('../models/Enrollment');

exports.getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await Enrollment.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const [rows] = await Enrollment.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Enrollment not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const { student_id, class_id } = req.body;
    const [result] = await Enrollment.create({ student_id, class_id });
    res.status(201).json({ id: result.insertId, student_id, class_id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const [result] = await Enrollment.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Enrollment not found' });
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
