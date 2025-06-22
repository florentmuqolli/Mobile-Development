const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, submissionController.getAllSubmissions);
router.get('/:id', authenticateToken, submissionController.getSubmissionById);
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), submissionController.createSubmission);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), submissionController.updateSubmission);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), submissionController.deleteSubmission);

module.exports = router;
