const express = require('express');
const router = express.Router();
const assingmentController = require('../controllers/assingmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, assingmentController.getAllSubmissions);
router.get('/:id', authenticateToken, assingmentController.getSubmissionById);
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), assingmentController.createSubmission);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), assingmentController.updateSubmission);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), assingmentController.deleteSubmission);

module.exports = router;
