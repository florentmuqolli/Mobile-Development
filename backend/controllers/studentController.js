const Student = require('../models/Student');

exports.getAllStudents = async (req, res) => {
  try {
    const [rows] = await Student.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const [rows] = await Student.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    console.log("body: ",req.body);
    const [result] = await Student.create({ name, email, phone, address });
    res.status(201).json({ id: result.insertId, name, email, phone, address });
  } catch (error) {
    console.error("Create Student error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const [result] = await Student.update(req.params.id, { name, email, phone, address });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const [result] = await Student.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
