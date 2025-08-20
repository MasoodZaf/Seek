const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const { protect, refreshTokenMiddleware } = require('../middleware/auth');
const { authRateLimit, strictRateLimit } = require('../middleware/security');
const {
  validateRegistration,
  validateLogin,
  validateUserUpdate,
  validatePasswordChange
} = require('../middleware/validation');

router.post('/register', authRateLimit, validateRegistration, authController.register);

router.post('/login', authRateLimit, validateLogin, authController.login);

router.post('/logout', authController.logout);

router.post('/refresh', refreshTokenMiddleware, authController.refreshToken);

router.get('/profile', protect, authController.getProfile);

router.put('/profile', protect, validateUserUpdate, authController.updateProfile);

router.put('/password', protect, strictRateLimit, validatePasswordChange, authController.changePassword);

router.delete('/account', protect, strictRateLimit, authController.deleteAccount);

module.exports = router;
