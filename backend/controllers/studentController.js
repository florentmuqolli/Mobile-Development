const Student = require('../models/Student');     
const User = require('../models/User');            
const ActivityLog = require('../models/ActivityLog'); 

exports.getAllStudents = async (req, res) => {
  try {
    const [students] = await Student.getAll();

    const enriched = await Promise.all(students.map(async (student) => {
      const user = await User.findById(student.user_id).select('name email password role');
      return {
        ...student,
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
        role: user?.role || '',
      };
    }));

    res.json(enriched);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const [rows] = await Student.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });

    const student = rows[0];
    const user = await User.findById(student.user_id).select('name email password role');

    res.json({
      ...student,
      name: user?.name || '',
      email: user?.email || '',
      password: user?.password || '',
      role: user?.role || '',
    });
  } catch (error) {
    console.error("Get student by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, phone, address, status } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({ name, email, password, role: 'student' });
    await user.save();

    const [result] = await Student.create({
      phone,
      address,
      status: status || 'Active',
      user_id: user._id.toString(),
    });
    await ActivityLog.create(req.user.name, 'added a new student', '👨‍🎓');

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone,
      address,
      status,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, status, password } = req.body;

    const [rows] = await Student.getById(id);
    if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });

    const student = rows[0];

    await Student.update(id, { phone, address, status });

    const user = await User.findById(student.user_id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) user.password = password;
      await user.save();
    }
    await ActivityLog.create(req.user.name, 'updated a student', '👨‍🎓');

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const [rows] = await Student.getById(studentId);
    if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });

    const student = rows[0];

    await User.findByIdAndDelete(student.user_id);

    await Student.delete(studentId);

    await ActivityLog.create(req.user.name, 'deleted a student', '👨‍🎓');

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
