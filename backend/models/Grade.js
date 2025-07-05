const db = require("../config/db");

const Grade = {
  create: ({ student_id, class_id, grade }) => {
    return db.query(
      "INSERT INTO grades (student_id, class_id, grade) VALUES (?, ?, ?)",
      [student_id, class_id, grade]
    );
  },

  update: ({ student_id, class_id, grade }) => {
    return db.query(
      "UPDATE grades SET grade = ?, graded_at = CURRENT_TIMESTAMP WHERE student_id = ? AND class_id = ?",
      [grade, student_id, class_id]
    );
  },

  getByStudentAndClass: (student_id, class_id) => {
    return db.query(
      "SELECT * FROM grades WHERE student_id = ? AND class_id = ?",
      [student_id, class_id]
    );
  },

  getByStudent: (student_id) => {
    return db.query(
      "SELECT g.*, c.title AS class_title FROM grades g INNER JOIN classes c ON g.class_id = c.id WHERE g.student_id = ?",
      [student_id]
    );
  },
  getByMultipleClasses: (classIds) => {
    if (classIds.length === 0) return Promise.resolve([[]]);

    const placeholders = classIds.map(() => "?").join(",");
    const sql = `
      SELECT g.*, s.user_id AS student_user_id, s.id AS student_id
      FROM grades g
      INNER JOIN students s ON g.student_id = s.id
      WHERE g.class_id IN (${placeholders})
    `;

    return db.query(sql, classIds);
  },

};

module.exports = Grade;
