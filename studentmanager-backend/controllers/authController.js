const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (user, type) => {
  const payload = { id: user._id, role: user.role };
  const secret = type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = type === 'access' ? '15m' : '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = createToken(user, 'access');
    const refreshToken = createToken(user, 'refresh');

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

    res.status(200).json({ accessToken, refreshToken, user: { id: user._id, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies; 
  
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const newAccessToken = createToken(user, 'access');
      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  };
  
  exports.logout = async (req, res) => {
    res.clearCookie('refreshToken'); 
    res.status(200).json({ message: 'Logged out successfully' });
  };
