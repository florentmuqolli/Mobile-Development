const Student = require('../models/Student');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

exports.getDashboardStats = async (req, res) => {
  try {
    const [studentCount] = await Student.getCount();
    const [newStudents] = await Student.getCountSince(getLastWeek());

    const [courseCount] = await Class.getCount();
    const [newCourses] = await Class.getCountSince(getLastWeek());

    const [professorCount] = await Teacher.getCount();
    const [newProfessors] = await Teacher.getCountSince(getLastWeek());

    res.json({
      students: {
        total: studentCount[0].count,
        new: newStudents[0].count,
      },
      courses: {
        total: courseCount[0].count,
        new: newCourses[0].count,
      },
      professors: {
        total: professorCount[0].count,
        new: newProfessors[0].count,
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

function getLastWeek() {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  return now.toISOString().slice(0, 19).replace('T', ' ');
}
