const db = require('../config/db');

const Attendance = {
  mark: ({ student_id, class_id, status, date }) => {
    return db.execute(
      `INSERT INTO attendances (student_id, class_id, status, date)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [student_id, class_id, status, date]
    );
  },

  getByCourseAndDate: (class_id, date) => {
    return db.execute(
      `SELECT * FROM attendances WHERE class_id = ? AND date = ?`,
      [class_id, date]
    );
  },

  getByCourse: (class_id, date = null) => {
    let query = `
      SELECT a.*, s.user_id
      FROM attendances a
      JOIN students s ON a.student_id = s.id
      WHERE a.class_id = ?
    `;
    const params = [class_id];

    if (date) {
      query += ` AND a.date = ?`;
      params.push(date);
    }

    return db.execute(query, params);
  },

  getSummaryByStudent: (student_id) => {
    return db.execute(`
      SELECT 
        c.id AS class_id,
        c.title AS class_title,
        COUNT(a.id) AS total_sessions,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS attended,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent,
        ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.id) * 100, 0) AS attendance_rate
      FROM attendances a
      JOIN classes c ON a.class_id = c.id
      WHERE a.student_id = ?
      GROUP BY a.class_id
    `, [student_id]);
  },

  getSummaryByTeacher: (teacher_id) => {
    return db.execute(`
      SELECT 
        c.id AS class_id,
        c.title AS class_title,
        COUNT(DISTINCT a.id) AS total_sessions,
        COUNT(DISTINCT e.id) AS total_students,
        ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0) * 100, 0) AS average_attendance_rate
      FROM classes c
      LEFT JOIN enrollments e ON e.class_id = c.id
      LEFT JOIN attendances a ON a.class_id = c.id AND a.student_id = e.student_id
      WHERE c.teacher_id = ?
      GROUP BY c.id
    `, [teacher_id]);
  }
};

module.exports = Attendance;
