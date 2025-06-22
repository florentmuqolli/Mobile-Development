const Submission = require('../models/Submission');

exports.getAllSubmissions = async (req, res) => {
  try {
    const [rows] = await Submission.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const [rows] = await Submission.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Submission not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    const { assignment_id, student_id, submission_text, grade, feedback } = req.body;
    const [result] = await Submission.create({
      assignment_id,
      student_id,
      submission_text,
      grade,
      feedback,
    });
    res.status(201).json({
      id: result.insertId,
      assignment_id,
      student_id,
      submission_text,
      grade,
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const { submission_text, grade, feedback } = req.body;
    const [result] = await Submission.update(req.params.id, {
      submission_text,
      grade,
      feedback,
    });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const [result] = await Submission.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
