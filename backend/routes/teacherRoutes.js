const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/teacher-stats', authenticateToken, authorizeRoles('admin','teacher'), teacherController.getTeacherStats);
router.get('/', authenticateToken, authorizeRoles('admin','teacher'), teacherController.getAllTeachers);
router.get('/:id', authenticateToken, authorizeRoles('admin','teacher'), teacherController.getTeacherById);
router.post('/', authenticateToken, authorizeRoles('admin'), teacherController.createTeacher);
router.put('/:id', authenticateToken, authorizeRoles('admin'), teacherController.updateTeacher);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), teacherController.deleteTeacher);

module.exports = router;