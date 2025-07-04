const express = require('express');
const {
  getAllEnrollments,
  getTotalStudentsByTeacher,
  createEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/total', authenticateToken, authorizeRoles('admin','teacher'), getTotalStudentsByTeacher);
router.get('/', authenticateToken, authorizeRoles('student','admin','teacher'), getAllEnrollments);
router.post('/', authenticateToken, authorizeRoles('student','admin','teacher'), createEnrollment);
router.delete('/:id', authenticateToken, authorizeRoles('student','admin','teacher'), deleteEnrollment);

module.exports = router;
