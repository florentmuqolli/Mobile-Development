const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/course/:course_id', authenticateToken, authorizeRoles('teacher'), attendanceController.getAttendanceByCourse);
router.get('/student/:student_id', authenticateToken, authorizeRoles('teacher'), attendanceController.getAttendanceSummaryByStudent);
router.get('/summary/teacher', authenticateToken, authorizeRoles('teacher'), attendanceController.getAttendanceSummaryByTeacher);

module.exports = router;