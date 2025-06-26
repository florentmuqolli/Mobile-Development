const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id, name: user.name, role: user.role }, secret, { expiresIn });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const student = await Student.getByEmail({email});
    const teacher = await Teacher.findByEmail({email});
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
  } catch (error) {
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
    console.log('user id: ',req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
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

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
};


