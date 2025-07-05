const Grade = require("../models/Grade");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");

exports.createGrade = async (req, res) => {
  try {
    const { student_id, class_id, grade } = req.body;

    if (!student_id || !class_id || grade == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await Grade.getByStudentAndClass(student_id, class_id);

    if (existing.length > 0) {
      return res.status(409).json({ message: "Grade already exists for this student and class" });
    }

    await Grade.create({ student_id, class_id, grade });

    res.status(201).json({ message: "Grade added successfully" });
  } catch (error) {
    console.error("Error creating grade:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { student_id, class_id, grade } = req.body;

    if (!student_id || !class_id || grade == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await Grade.getByStudentAndClass(student_id, class_id);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Grade not found" });
    }

    await Grade.update({ student_id, class_id, grade });

    res.json({ message: "Grade updated successfully" });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGradesByRole = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role; 

    if (role === "teacher") {
      const teacher = await Teacher.getByUserId(userId);
      if (!teacher) {
        return res.status(403).json({ message: "Unauthorized: Not a teacher" });
      }

      const [classes] = await Class.getByTeacherId(teacher.id);
      const classIds = classes.map(cls => cls.id);

      if (classIds.length === 0) {
        return res.json([]); 
      }

      const [grades] = await Grade.getByMultipleClasses(classIds);
      return res.json(grades);

    } else if (role === "student") {
      const student = await Student.getByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const [rows] = await Grade.getByStudent(student.id);
      return res.json(rows);

    } else {
      return res.status(403).json({ message: "Unauthorized: Invalid role" });
    }

  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ message: "Server error" });
  }
};