const db = require('../config/db');

const Student = {
  getAll: () => db.query('SELECT * FROM students'),
  getCount: () => db.query('SELECT COUNT(*) AS count FROM students'),
  getCountSince: (date) => db.query('SELECT COUNT(*) AS count FROM students WHERE created_at >= ?', [date]),
  getById: (id) => db.query('SELECT * FROM students WHERE id = ?', [id]),
  getByEmail: (email) => db.query('SELECT * FROM students WHERE email = ?', [email]),
  create: (data) => db.query(
    'INSERT INTO students (name, email, phone, address, status, password) VALUES (?, ?, ?, ?, ?, ?)', 
    [data.name, data.email, data.phone, data.address, data.status || 'Active', data.password ]
  ),
  update: (id, data) => db.query(
    'UPDATE students SET name = ?, email = ?, phone = ?, address = ?, status = ?, password = ? WHERE id = ?',
    [data.name, data.email, data.phone, data.address, data.status, data.password, id]
  ),
  delete: (id) => db.query('DELETE FROM students WHERE id = ?', [id]),
};

module.exports = Student;
