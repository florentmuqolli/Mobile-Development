const Teacher = require('../models/Teacher');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await Teacher.getAll();

    const enriched = await Promise.all(teachers.map(async (teacher) => {
      const user = await User.findById(teacher.user_id).select('name email password role');
      return {
        ...teacher,
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
        role: user?.role || '',
      };
    }));

    res.json(enriched);
  } catch (error) {
    console.error("Get all teachers error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const [rows] = await Teacher.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Teacher not found' });

    const teacher = rows[0];
    const user = await User.findById(teacher.user_id).select('name email password role');

    res.json({
      ...teacher,
      name: user?.name || '',
      email: user?.email || '',
      password: user?.password || '',
      role: user?.role || '',
    });
  } catch (error) {
    console.error("Get teacher by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, phone, department, status } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({ name, email, password, role: 'teacher' });
    await user.save();

    const [result] = await Teacher.create({
      phone,
      department,
      status: status || 'Active',
      user_id: user._id.toString(),
    });
    console.log('user: ', req.user.name);
    await ActivityLog.create(req.user.name, 'added a new teacher', '👨‍🏫');

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone,
      department,
      status,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, status, password } = req.body;

    const [rows] = await Teacher.findById(id);
    if (rows.length === 0) return res.status(404).json({ message: 'Teacher not found' });

    const teacher = rows[0];

    await Teacher.update(id, { phone, department, status });

    const user = await User.findById(teacher.user_id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) user.password = password;
      await user.save();
    }

    await ActivityLog.create(req.user.name, 'updated a teacher', '👨‍🏫');

    res.json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error("Update teacher error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    const [rows] = await Teacher.findById(teacherId);
    if (rows.length === 0) return res.status(404).json({ message: 'Teacher not found' });

    const teacher = rows[0];

    await User.findByIdAndDelete(teacher.user_id);

    await Teacher.delete(teacherId);

    await ActivityLog.create(req.user.name, 'deleted a teacher', '👨‍🏫');

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error("Delete teacher error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
