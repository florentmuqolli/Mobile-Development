const express = require('express');
const {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('admin', 'trainer'), getWorkoutPlans);
router.get('/my-plans', authenticateToken, authorizeRoles('member'), getMyWorkoutPlans);
router.post('/', authenticateToken, authorizeRoles('admin', 'trainer'), createWorkoutPlan);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'trainer'), updateWorkoutPlan);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'trainer'), deleteWorkoutPlan);

module.exports = router;
