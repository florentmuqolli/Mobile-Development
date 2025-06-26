const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticateToken, authorizeRoles} = require('../middleware/auth')

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get("/me", authenticateToken, authController.getUserProfile);
router.put("/me", authenticateToken, authController.updateUserProfile);
router.get('/users', authenticateToken, authController.getUsersByRole);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);
router.post('/request-register', authController.requestRegister);
router.get('/check-request-status', authController.checkRequestStatus);

module.exports = router;
