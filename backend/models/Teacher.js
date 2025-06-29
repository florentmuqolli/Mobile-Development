const db = require('../config/db');

const Teacher = {
  getAll: () => db.query('SELECT * FROM teachers'),
  getCount: () => db.query('SELECT COUNT(*) AS count FROM teachers'),
  getCountSince: (date) => db.query('SELECT COUNT(*) AS count FROM teachers WHERE created_at >= ?', [date]),
  findById: (id) => db.query('SELECT * FROM teachers WHERE id = ?', [id]),
  getByUserId: async (userId) => {
    const [rows] = await db.execute('SELECT id FROM teachers WHERE user_id = ?', [userId]);
    return rows[0]; 
  },
  findByEmail: (email) => db.query('SELECT * FROM teachers WHERE email = ?', [email]),
  create: (data) => db.query(
    `INSERT INTO teachers ( phone, department, status, user_id)
    VALUES (?, ?, ?, ?)`,
    [data.phone, data.department, data.status, data.user_id]
  ),

  update: (id, data) => db.query(
    'UPDATE teachers SET phone = ?, department = ?, status = ? WHERE id = ?',
    [data.phone, data.department, data.status, id]
  ),
  delete: (id) => db.query('DELETE FROM teachers WHERE id = ?', [id]),
};

module.exports = Teacher;