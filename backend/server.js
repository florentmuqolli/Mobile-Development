require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');
const mysqlPool = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
//const workoutRotues = require('./routes/workoutRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const workoutPlanRoutes = require('./routes/workoutPlanRoutes')

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
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
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);
//app.use('/api/workout', workoutRotues);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
