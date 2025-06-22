const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', roleMiddleware('admin', 'teacher'), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', roleMiddleware('admin', 'teacher'), taskController.updateTask);
router.delete('/:id', roleMiddleware('admin'), taskController.deleteTask);

module.exports = router;
