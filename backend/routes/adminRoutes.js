const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), AdminController.getDashboardStats);
router.get('/recent-activities', authenticateToken, authorizeRoles('admin'), AdminController.getRecentActivities);
router.get('/pending-requests', authenticateToken, authorizeRoles('admin'), AdminController.getPendingRequests);
router.post('/approve-request/:id', authenticateToken, authorizeRoles('admin'), AdminController.approveRequest);
router.delete('/deny-request/:id', authenticateToken, authorizeRoles('admin'), AdminController.denyRequest);

module.exports = router;
