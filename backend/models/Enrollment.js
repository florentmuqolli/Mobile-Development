const db = require('../config/db');

const Enrollment = {
  getAll: () => db.query('SELECT * FROM enrollments'),

  getById: (id) => db.query('SELECT * FROM enrollments WHERE id = ?', [id]),

  getByStudentId: (studentId) =>
    db.query('SELECT * FROM enrollments WHERE student_id = ?', [studentId]),

  getByClassId: (classId) =>
    db.query('SELECT * FROM enrollments WHERE class_id = ?', [classId]),

  create: (data) =>
    db.query(
      'INSERT INTO enrollments (student_id, class_id) VALUES (?, ?)',
      [data.student_id, data.class_id]
    ),

  delete: (id) => db.query('DELETE FROM enrollments WHERE id = ?', [id]),
};

module.exports = Enrollment;
