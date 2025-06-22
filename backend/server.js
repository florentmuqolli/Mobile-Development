require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');
const mysqlPool = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();

app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());



connectDB();
mysqlPool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

  app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/class', classRoutes);
app.use('/api/assignment', assignmentRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
