const db = require('../config/db');

const Enrollment = {
  getAll: () => db.query('SELECT * FROM enrollments'),

  getById: (id) => db.query('SELECT * FROM enrollments WHERE id = ?', [id]),

  getByStudentId: (studentId) =>
    db.query('SELECT * FROM enrollments WHERE student_id = ?', [studentId]),

  getStudentsByClassId: (classId) => {
      return db.query(`
        SELECT s.id, s.user_id
        FROM enrollments e
        INNER JOIN students s ON e.student_id = s.id
        WHERE e.class_id = ?
      `, [classId]);
    },

  countStudentsByTeacherId: async (teacherId) => {
    const [[result]] = await db.execute(`
      SELECT COUNT(DISTINCT student_id) AS totalStudents
      FROM enrollments
      WHERE class_id IN (
        SELECT id FROM classes WHERE teacher_id = ?
      )
    `, [teacherId]);
    return result.totalStudents;
  },

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
