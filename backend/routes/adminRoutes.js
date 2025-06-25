const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/dashboard-stats',authenticateToken, authorizeRoles('admin'), AdminController.getDashboardStats);

module.exports = router;
