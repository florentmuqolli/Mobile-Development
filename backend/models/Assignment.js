const pool = require('../config/db');

const Assignment = {

  getAllByTeacher: (teacherId) =>
    pool.query(
      `SELECT a.* FROM assignments a
       JOIN classes c ON a.class_id = c.id
       WHERE c.teacher_id = ?`,
      [teacherId]
    ),

  getSubmissionsByAssignment: (assignmentId) =>
    pool.query(
      `SELECT s.*, st.user_id
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      WHERE s.assignment_id = ?`,
      [assignmentId]
    ),

  countSubmissionsByAssignment: (assignmentId) =>
    pool.query(
      `SELECT COUNT(*) AS count FROM submissions WHERE assignment_id = ?`,
      [assignmentId]
    ),

  getAll: () => pool.query('SELECT * FROM assignments'),

  getById: (id) => pool.query('SELECT * FROM assignments WHERE id = ?', [id]),

  create: (data) =>
    pool.query(
      'INSERT INTO assignments (class_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [data.class_id, data.title, data.description, data.due_date]
    ),

  update: (id, data) =>
    pool.query(
      'UPDATE assignments SET class_id = ?, title = ?, description = ?, due_date = ? WHERE id = ?',
      [data.class_id, data.title, data.description, data.due_date, id]
    ),

  delete: (id) => pool.query('DELETE FROM assignments WHERE id = ?', [id]),
};

module.exports = Assignment;
