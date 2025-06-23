const express = require('express');
const router = express.Router();
const assingmentController = require('../controllers/assingmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, assingmentController.getAllAssignments);
router.get('/:id', authenticateToken, assingmentController.getAssignmentById);
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), assingmentController.createAssignment);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), assingmentController.updateAssignment);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), assingmentController.deleteAssignment);

module.exports = router;
