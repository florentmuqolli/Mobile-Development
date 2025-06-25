const db = require('../config/db');

const Teacher = {
  getAll: () => db.query('SELECT * FROM teachers'),
  getCount: () => db.query('SELECT COUNT(*) AS count FROM teachers'),
  getCountSince: (date) => db.query('SELECT COUNT(*) AS count FROM teachers WHERE created_at >= ?', [date]),
  findById: (id) => db.query('SELECT * FROM teachers WHERE id = ?', [id]),
  findByEmail: (email) => db.query('SELECT * FROM teachers WHERE email = ?', [email]),
  create: (data) => db.query(
    'INSERT INTO teachers (name, email, phone, department, status, password) VALUES (?, ?, ?, ?, ?, ?)',
    [data.name, data.email, data.phone, data.department, data.status, data.password ]
  ),
  update: (id, data) => db.query(
    'UPDATE teachers SET name = ?, email = ?, phone = ?, department = ?, status = ?, password = ? WHERE id = ?',
    [data.name, data.email, data.phone, data.department, data.status, data.password, id]
  ),
  delete: (id) => db.query('DELETE FROM teachers WHERE id = ?', [id]),
};

module.exports = Teacher;