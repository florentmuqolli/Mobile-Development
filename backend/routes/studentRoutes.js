const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const classController = require('../controllers/classController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/specific-class', authenticateToken, authorizeRoles('student','admin'),classController.getClassByStudent);
router.get('/', authenticateToken, authorizeRoles('admin', 'teacher'), studentController.getAllStudents);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'teacher', 'student'), studentController.getStudentById);
router.post('/', authenticateToken, authorizeRoles('admin'), studentController.createStudent);
router.put('/:id', authenticateToken, authorizeRoles('admin'), studentController.updateStudent);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), studentController.deleteStudent);

module.exports = router;
