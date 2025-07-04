const Enrollment = require('../models/Enrollment');
const ActivityLog = require('../models/ActivityLog');
const Teacher = require('../models/Teacher');

exports.getTotalStudentsByTeacher = async (req, res) => {
  try {
    const userId = req.user?.id;
        
    const teacher = await Teacher.getByUserId(userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const teacherId = teacher.id;
    const totalStudents = await Enrollment.countStudentsByTeacherId(teacherId);
    res.status(200).json({ totalStudents });
  } catch (err) {
    console.error('Error fetching total students:', err);
    res.status(500).json({ error: 'Failed to get total students' });
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const [rows] = await Enrollment.getAll();
    res.json(rows);
  } catch (error) {
    console.error("Error getting enrollments:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const [rows] = await Enrollment.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Enrollment not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting enrollment:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const { student_id, class_id } = req.body;
    const [result] = await Enrollment.create({ student_id, class_id });
    
    await ActivityLog.create(req.user.name, 'just enrolled', '⚙️');

    res.status(201).json({ id: result.insertId, student_id, class_id });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const [result] = await Enrollment.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Enrollment not found' });

    await ActivityLog.create(req.user.name, 'deleted an enrollment', '⚙️');

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
