const express = require('express');
const router = express.Router();
const controller = require('../controllers/classController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', controller.getAllClasses);
router.get('/:id', controller.getClassById);
router.post('/', authenticateToken, authorizeRoles('admin'), controller.createClass);
router.put('/:id', authenticateToken, authorizeRoles('admin'), controller.updateClass);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), controller.deleteClass);

module.exports = router;
