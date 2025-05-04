const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin']), subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.put('/:id', roleMiddleware(['admin']), subjectController.updateSubject);
router.delete('/:id', roleMiddleware(['admin']), subjectController.deleteSubject);

module.exports = router;
