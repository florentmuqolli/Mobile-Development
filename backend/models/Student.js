const db = require('../config/db');

const Student = {
  getAll: () => db.query('SELECT * FROM students'),
  getById: (id) => db.query('SELECT * FROM students WHERE id = ?', [id]),
  create: (data) => db.query(
    'INSERT INTO students (name, email, phone, address, status) VALUES (?, ?, ?, ?, ?)', 
    [data.name, data.email, data.phone, data.address, data.status || 'Active' ]
  ),
  update: (id, data) => db.query(
    'UPDATE students SET name = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?',
    [data.name, data.email, data.phone, data.address, data.status, id]
  ),
  delete: (id) => db.query('DELETE FROM students WHERE id = ?', [id]),
};

module.exports = Student;
