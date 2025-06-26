const db = require('../config/db');

const Student = {
  getAll: () => db.query('SELECT * FROM students'),
  getCount: () => db.query('SELECT COUNT(*) AS count FROM students'),
  getCountSince: (date) => db.query('SELECT COUNT(*) AS count FROM students WHERE created_at >= ?', [date]),
  getById: (id) => db.query('SELECT * FROM students WHERE id = ?', [id]),
  getByEmail: (email) => db.query('SELECT * FROM students WHERE email = ?', [email]),
  create: (data) => db.query(
    `INSERT INTO students ( phone, address, status, user_id)
    VALUES (?, ?, ?, ?)`,
    [data.phone, data.address, data.status || 'Active', data.user_id]
  ),

  update: (id, data) => db.query(
    'UPDATE students SET phone = ?, address = ?, status = ? WHERE id = ?',
    [data.phone, data.address, data.status, id]
  ),
  delete: (id) => db.query('DELETE FROM students WHERE id = ?', [id]),
};

module.exports = Student;
