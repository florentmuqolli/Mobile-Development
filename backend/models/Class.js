const db = require('../config/db');

const Class = {
  getAll: () => db.query(`
    SELECT c.id, c.title, c.description, c.day, c.schedule, c.teacher_id, c.room, c.status, t.user_id AS teacher_user_id
    FROM classes c
    LEFT JOIN teachers t ON c.teacher_id = t.id
  `),
  getCount: () => db.query('SELECT COUNT(*) AS count FROM classes'),
  getCountSince: (date) => db.query('SELECT COUNT(*) AS count FROM classes WHERE created_at >= ?', [date]),
  getById: (id) => db.query('SELECT * FROM classes WHERE id = ?', [id]),
  getByTeacherId: (teacherId) => db.query('SELECT * FROM classes WHERE teacher_id = ?', [teacherId]),
  getByStudentId: (studentId) => 
  db.query(`
    SELECT c.id, c.title, c.description, c.day, c.schedule, c.room, t.user_id AS teacher_user_id
    FROM classes c
    INNER JOIN enrollments e ON c.id = e.class_id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    WHERE e.student_id = ?
  `, [studentId]),
  countByTeacherId: async (teacherId) => {
    const [[result]] = await db.execute(`
      SELECT COUNT(*) AS totalCourses FROM classes WHERE teacher_id = ?
    `, [teacherId]);
    return result.totalCourses;
  },
  create: (data) =>
    db.query('INSERT INTO classes (title, description, teacher_id, schedule, day, room, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      data.title,
      data.description,
      data.teacher_id,
      data.schedule,
      data.day,
      data.room,
      data.status
    ]),
  update: (id, data) =>
    db.query(
      'UPDATE classes SET title = ?, description = ?, teacher_id = ?, schedule = ?, day = ?, room = ?, status = ? WHERE id = ?',
      [data.title, data.description, data.teacher_id, data.schedule, data.day, data.room, data.status, id]
    ),
  delete: (id) => db.query('DELETE FROM classes WHERE id = ?', [id]),
};

module.exports = Class;

