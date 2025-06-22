const db = require('../config/db');

const Submission = {
  getAll: () => db.query('SELECT * FROM submissions'),

  getById: (id) => db.query('SELECT * FROM submissions WHERE id = ?', [id]),

  getByAssignmentId: (assignmentId) =>
    db.query('SELECT * FROM submissions WHERE assignment_id = ?', [assignmentId]),

  getByStudentId: (studentId) =>
    db.query('SELECT * FROM submissions WHERE student_id = ?', [studentId]),

  create: (data) =>
    db.query(
      'INSERT INTO submissions (assignment_id, student_id, submission_text, grade, feedback) VALUES (?, ?, ?, ?, ?)',
      [data.assignment_id, data.student_id, data.submission_text, data.grade, data.feedback]
    ),

  update: (id, data) =>
    db.query(
      'UPDATE submissions SET submission_text = ?, grade = ?, feedback = ? WHERE id = ?',
      [data.submission_text, data.grade, data.feedback, id]
    ),

  delete: (id) => db.query('DELETE FROM submissions WHERE id = ?', [id]),
};

module.exports = Submission;
