const db = require('../config/db');

const Class = {
  getAll: () => db.query('SELECT * FROM classes'),
  getCount: () => db.query('SELECT COUNT(*) AS count FROM classes'),
  getCountSince: (date) => db.query('SELECT COUNT(*) AS count FROM classes WHERE created_at >= ?', [date]),
  getById: (id) => db.query('SELECT * FROM classes WHERE id = ?', [id]),
  create: (data) =>
    db.query('INSERT INTO classes (title, description, teacher_id, schedule, room, status) VALUES (?, ?, ?, ?, ?, ?)', [
      data.title,
      data.description,
      data.teacher_id,
      data.schedule,
      data.room,
      data.status
    ]),
  update: (id, data) =>
    db.query(
      'UPDATE classes SET title = ?, description = ?, teacher_id = ?, schedule = ?, room = ?, status = ? WHERE id = ?',
      [data.title, data.description, data.teacher_id, data.schedule, data.room, data.status, id]
    ),
  delete: (id) => db.query('DELETE FROM classes WHERE id = ?', [id]),
};

module.exports = Class;

