const Teacher = require('../models/Teacher');

exports.getAllTeachers = async (req, res) => {
  try {
    const [rows] = await Teacher.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const [rows] = await Teacher.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phone, specialty, experience } = req.body;

    if (!name || !email || !phone || !specialty || !experience) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address"
      });
    }

    if (!/^\d{7,15}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number should contain 7-15 digits"
      });
    }

    const [existingTeacher] = await Teacher.findByEmail(email);
    if (existingTeacher.length > 0) {
      return res.status(409).json({
        message: "A teacher with this email already exists"
      });
    }

    const [result] = await Teacher.create({ 
      name, 
      email, 
      phone, 
      department
    });

    res.status(201).json({ 
      id: result.insertId, 
      name, 
      email, 
      phone, 
      department
    });

  } catch (error) {
    console.error("Create Teacher error:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: "A Teacher with this email or phone already exists"
      });
    }
    
    res.status(500).json({ 
      message: error.sqlMessage || "Error creating Teacher" 
    });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, phone, specialty, experience } = req.body;
    
    if (!name || !email || !phone || !specialty || !experience) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const [result] = await Teacher.update(req.params.id, { 
      name, 
      email, 
      phone, 
      department
    });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const [teacher] = await Teacher.findById(req.params.id);
    res.json({ 
      message: 'Teacher updated successfully',
      teacher: teacher[0]
    });
  } catch (error) {
    console.error('Update Teacher error:', error);
    res.status(500).json({ 
      message: error.sqlMessage || 'Server error' 
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const [result] = await Teacher.delete(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
