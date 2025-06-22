const express = require('express');
const {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('admin', 'teacher'), getAllEnrollments);
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), createEnrollment);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), deleteEnrollment);

module.exports = router;
