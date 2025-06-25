const db = require('../config/db');

const Teacher = {
  getAll: () => db.query('SELECT * FROM teachers'),
  findById: (id) => db.query('SELECT * FROM teachers WHERE id = ?', [id]),
  findByEmail: (email) => db.query('SELECT * FROM teachers WHERE email = ?', [email]),
  create: (data) => db.query(
    'INSERT INTO teachers (name, email, phone, department, status) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.email, data.phone, data.department, data.status ]
  ),
  update: (id, data) => db.query(
    'UPDATE teachers SET name = ?, email = ?, phone = ?, department = ?, status = ? WHERE id = ?',
    [data.name, data.email, data.phone, data.department, data.status, id]
  ),
  delete: (id) => db.query('DELETE FROM teachers WHERE id = ?', [id]),
};

module.exports = Teacher;