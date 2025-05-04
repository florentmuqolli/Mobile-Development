const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['teacher', 'admin']), gradeController.addGrade);
router.get('/', roleMiddleware(['teacher', 'admin']), gradeController.getAllGrades);
router.get('/student/:studentId', gradeController.getGradesByStudent);

module.exports = router;
