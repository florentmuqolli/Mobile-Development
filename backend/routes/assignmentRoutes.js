const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('teacher', 'student'), assignmentController.getAssignmentsByRole);
router.get('/:id', authenticateToken, authorizeRoles('teacher'), assignmentController.getAssignmentById);
router.get('/:id/activity', authenticateToken, authorizeRoles('teacher'), assignmentController.getAssignmentActivity);
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), assignmentController.createAssignment);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), assignmentController.updateAssignment);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), assignmentController.deleteAssignment);

module.exports = router;
