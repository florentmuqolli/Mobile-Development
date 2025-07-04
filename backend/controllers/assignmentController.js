const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

exports.getAssignmentsByRole = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    if (role === 'teacher') {
      const teacher = await Teacher.getByUserId(userId);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      const teacherId = teacher.id;
      const [assignments] = await Assignment.getAllByTeacher(teacherId);
      return res.json(assignments);

    } else if (role === 'student') {
      const student = await Student.getByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      const studentId = student.id;
      const [assignments] = await Assignment.getAllByStudent(studentId);
      return res.json(assignments);

    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAssignmentActivity = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const [submissions] = await Assignment.getSubmissionsByAssignment(assignmentId);

    const enrichedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        let studentName = 'Unknown';
        if (sub.user_id) {
          const user = await User.findById(sub.user_id).select('name email');
          if (user) {
            studentName = user.name;
          }
        }

        return {
          ...sub,
          student_name: studentName,
        };
      })
    );

    const [countResult] = await Assignment.countSubmissionsByAssignment(assignmentId);

    res.json({
      total_submissions: countResult[0].count,
      submissions: enrichedSubmissions,
    });
  } catch (error) {
    console.error('Get assignment activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllAssignments = async (req, res) => {
  try {
    const [rows] = await Assignment.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const [rows] = await Assignment.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Get assignment by id error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { class_id, title, description, due_date } = req.body;
    const [result] = await Assignment.create({ class_id, title, description, due_date });
    res.status(201).json({ id: result.insertId, class_id, title, description, due_date });
  } catch (error) {
    console.error('Create assignment error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { class_id, title, description, due_date } = req.body;
    const [result] = await Assignment.update(req.params.id, {
      class_id,
      title,
      description,
      due_date,
    });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Update assignment error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const [result] = await Assignment.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
