const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'teacher'), studentController.getAllStudents);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'teacher', 'student'), studentController.getStudentById);
router.post('/', authenticateToken, authorizeRoles('admin'), studentController.createStudent);
router.put('/:id', authenticateToken, authorizeRoles('admin'), studentController.updateStudent);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), studentController.deleteStudent);

module.exports = router;
