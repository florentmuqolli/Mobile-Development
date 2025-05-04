const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin']), classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.put('/:id', roleMiddleware(['admin']), classController.updateClass);
router.delete('/:id', roleMiddleware(['admin']), classController.deleteClass);

module.exports = router;
