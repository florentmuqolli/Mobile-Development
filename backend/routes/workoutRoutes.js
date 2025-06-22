const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, workoutController.getAllWorkouts);
router.get('/:id', authenticateToken, workoutController.getWorkoutById);
router.post('/', authenticateToken, authorizeRoles('admin', 'trainer'), workoutController.createWorkout);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'trainer'), workoutController.updateWorkout);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), workoutController.deleteWorkout);

module.exports = router;
