const db = require('../config/db');

const ActivityLog = {
  create: (user, action, icon = 'ℹ️') => {
    return db.execute(
      'INSERT INTO activity_logs (user, action, icon) VALUES (?, ?, ?)',
      [user, action, icon]
    );
  },

  getRecent: () => {
    return db.execute('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10');
  }
};

module.exports = ActivityLog;
