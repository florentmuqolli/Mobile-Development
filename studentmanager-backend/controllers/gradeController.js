const Grade = require('../models/Grade');

exports.addGrade = async (req, res) => {
  try {
    const grade = await Grade.create(req.body);
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add grade', details: err.message });
  }
};

exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'name')
      .populate('class', 'name');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grades', details: err.message });
  }
};

exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('class', 'name');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student grades', details: err.message });
  }
};
