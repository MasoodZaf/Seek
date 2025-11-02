const csrf = require('csurf');
const logger = require('../config/logger');

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
});

// Middleware to send CSRF token to client
const sendCsrfToken = (req, res) => {
  res.json({
    success: true,
    csrfToken: req.csrfToken()
  });
};

// Error handler for CSRF token errors
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  logger.warn('CSRF token validation failed:', {
    ip: req.ip,
    url: req.originalUrl,
    userAgent: req.get('User-Agent')
  });

  res.status(403).json({
    success: false,
    message: 'Invalid CSRF token. Please refresh the page and try again.',
    code: 'CSRF_INVALID'
  });
};

module.exports = {
  csrfProtection,
  sendCsrfToken,
  csrfErrorHandler
};
