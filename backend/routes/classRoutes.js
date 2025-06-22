const express = require('express');
const router = express.Router();
const controller = require('../controllers/classController');

router.get('/', controller.getAllClasses);
router.get('/:id', controller.getClassById);
router.post('/', controller.createClass);
router.put('/:id', controller.updateClass);
router.delete('/:id', controller.deleteClass);

module.exports = router;
