const pool = require('../config/db');

const Assignment = {
  getAll: () => pool.query('SELECT * FROM assignments'),

  getById: (id) => pool.query('SELECT * FROM assignments WHERE id = ?', [id]),

  create: (data) =>
    pool.query(
      'INSERT INTO assignments (class_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [data.class_id, data.title, data.description, data.due_date]
    ),

  update: (id, data) =>
    pool.query(
      'UPDATE assignments SET class_id = ?, title = ?, description = ?, due_date = ? WHERE id = ?',
      [data.class_id, data.title, data.description, data.due_date, id]
    ),

  delete: (id) => pool.query('DELETE FROM assignments WHERE id = ?', [id]),
};

module.exports = Assignment;
