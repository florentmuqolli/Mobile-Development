const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['teacher', 'admin']), attendanceController.markAttendance);
router.get('/', roleMiddleware(['teacher', 'admin']), attendanceController.getAllAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);

module.exports = router;
