const express = require('express');
const controller = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify-email', controller.verifyEmail);
router.post('/resend-verification', controller.resendVerificationEmail);
router.get('/me', authenticateToken, controller.me);
router.put('/profile', authenticateToken, controller.updateProfile);
router.patch('/password', authenticateToken, controller.updatePassword);

module.exports = router;