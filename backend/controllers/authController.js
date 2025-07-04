const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const ActivityLog = require('../models/ActivityLog');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id, name: user.name, role: user.role }, secret, { expiresIn });
};

exports.register = async (req, res) => {
  const { name, email, password, role, ...rest } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save(); 

    const commonFields = { name, email, user_id: user._id.toString(), status: 'Active', ...rest };

    if (role === 'student') {
      await Student.create(commonFields);
    } else if (role === 'teacher') {
      await Teacher.create(commonFields);
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


exports.requestRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await PendingUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'A request for this email already exists' });
    }

    const pending = new PendingUser({
      name,
      email,
      password,
      role,
      status: 'pending'
    });

    await pending.save();

    await ActivityLog.create(pending.name, 'requested to register as a user', '⚠️');

    res.status(200).json({ message: 'Registration request submitted for admin approval' });
  } catch (error) {
    console.error('Register request failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkRequestStatus = async (req, res) => {
  const { email } = req.query;
  const request = await PendingUser.findOne({ email });
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }
  res.json({ status: request.status });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const pendingUser = await PendingUser.findOne({ email });
      if (pendingUser && pendingUser.status !== 'approved') {
        return res.status(403).json({
          message:
            pendingUser.status === 'denied'
              ? 'Your registration was denied by the admin.'
              : 'Your registration is still pending approval.',
        });
      }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateToken(user, process.env.JWT_SECRET, '15m');
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, '7d');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });

    await ActivityLog.create(user.name, 'logged in', '🔓');

  } catch (error) {
    console.error('Login request failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    console.log('Decoded refresh token:', user);
    res.status(200).json({ accessToken: newAccessToken });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
  httpOnly: true,
  sameSite: 'None', 
  secure: false,    
  path: '/api/auth/refresh-token',
});

  return res.status(200).json({ message: 'Logged out successfully' });
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userId = req.user.id;

    const studentObj = await Student.getByUserId(userId);
    if (!studentObj) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const studentId = studentObj.id;

    const [studentRows] = await Student.getById(studentId);
    if (!studentRows || studentRows.length === 0) {
      return res.status(404).json({ message: 'Student details not found' });
    }
    const student = studentRows[0];
    console.log('student: ',student);

    res.status(200).json({
      ...user.toObject(),
      studentId: student.id,
      studentStatus: student.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.query.role;
    if (!role) {
      return res.status(400).json({ message: 'Role query parameter is required' });
    }

    const users = await User.find({ role }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetCode = user.generateResetCode();
    await user.save({ validateBeforeSave: false });

    const message = `
      <h1>Password Reset Request</h1>
      <p>Your password reset code is:</p>
      <h2>${resetCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Code',
      html: message,
    });

    res.status(200).json({ message: 'Password reset code sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending reset code email' });
  }
};

exports.verifyResetCode = async (req, res) => {
  let { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }

  email = email.trim().toLowerCase();
  code = code.trim();

  const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

  try {
    const user = await User.findOne({
      email,
      resetPasswordCode: hashedCode,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

    res.status(200).json({ message: 'Code is valid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while verifying code' });
  }
};


exports.resetPassword = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  email = email.trim().toLowerCase();
  password = password.trim();

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordCode || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: 'Reset code expired or not verified' });
    }

    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await ActivityLog.create(req.user.name, 'reset account password', '🛠️');

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
};


