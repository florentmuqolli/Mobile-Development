const PendingUser = require('../models/PendingUser');
const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const ActivityLog = require('../models/ActivityLog');

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await PendingUser.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const pending = await PendingUser.findById(req.params.id);
    if (!pending) return res.status(404).json({ message: 'Request not found' });

    const { name, email, password, role } = pending;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    if (role === 'student') {
      await Student.create({
        name,
        email,
        password,
        user_id: user._id.toString(),
        phone: '',
        address: '',
        status: 'Active'
      });
    } else if (role === 'teacher') {
      await Teacher.create({
        name,
        email,
        password,
        user_id: user._id.toString(),
        phone: '',
        department: '',
        status: 'Active'
      });
    }

    pending.status = 'approved';
    await pending.save();

    await ActivityLog.create(req.user.name, 'approved a user registration request', '✅');

    res.status(200).json({ message: 'Request approved and user created' });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.denyRequest = async (req, res) => {
  try {
    const pending = await PendingUser.findById(req.params.id);
    if (!pending) return res.status(404).json({ message: 'Request not found' });

    pending.status = 'denied';
    pending.handledAt = new Date();
    await pending.save();

    await ActivityLog.create(req.user.name, 'denied a user registration request', '❌');

    res.status(200).json({ message: 'Request denied successfully' });
  } catch (err) {
    console.error('Deny error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const [activityLogs] = await ActivityLog.getRecent();

    res.json (activityLogs);
  } catch (error) {
      console.error('Dashboard Error:', error);
      res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

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
      },
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
