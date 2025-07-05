const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");
const { authenticateToken, authorizeRoles} = require("../middleware/auth");

router.get("/my", authenticateToken, authorizeRoles('student','teacher','admin'), gradeController.getGradesByRole);
//router.get("/id", authenticateToken, authorizeRoles('student','teacher','admin'), gradeController.getGradesByClass);
router.post("/", authenticateToken, authorizeRoles('teacher','admin'), gradeController.createGrade);
router.put("/", authenticateToken, authorizeRoles('teacher','admin'), gradeController.updateGrade);

module.exports = router;
