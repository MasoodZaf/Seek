const rateLimit = require('express-rate-limit');
const { rateLimitHandler } = require('./errorHandler');
const logger = require('../config/logger');

const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => rateLimit({
  windowMs,
  max,
  message: {
    success: false,
    message
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests,
  handler: rateLimitHandler
});

const generalRateLimit = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100, // 100 requests
  'Too many requests from this IP, please try again later'
);

const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 attempts (increased for testing)
  'Too many authentication attempts, please try again later',
  true // Skip successful requests
);

const codeExecutionRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 executions per minute
  'Too many code executions, please wait before trying again'
);

const strictRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  3, // 3 requests
  'Rate limit exceeded for this sensitive operation'
);

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.) or from allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5001'
    ];

    logger.debug('CORS check:', { origin, allowedOrigins });

    // In development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.error('CORS blocked origin:', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset']
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

const requestLogging = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      ...(req.user && { userId: req.user.id, username: req.user.username })
    };

    if (res.statusCode >= 400) {
      logger.warn('Request completed with error:', logData);
    } else {
      logger.info('Request completed:', logData);
    }
  });

  next();
};

const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json') && !req.is('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Content-Type. Expected application/json or multipart/form-data'
      });
    }
  }
  next();
};

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();

        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        obj[key] = obj[key].replace(/javascript:/gi, '');
        obj[key] = obj[key].replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    });
  };

  if (req.body && typeof req.body === 'object') {
    sanitize(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    sanitize(req.query);
  }

  next();
};

const ipWhitelist = (allowedIPs = []) => (req, res, next) => {
  if (allowedIPs.length === 0) {
    return next();
  }

  const clientIP = req.ip || req.connection.remoteAddress;

  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    logger.warn('Blocked request from unauthorized IP:', { ip: clientIP, url: req.originalUrl });
    res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
};

module.exports = {
  generalRateLimit,
  authRateLimit,
  codeExecutionRateLimit,
  strictRateLimit,
  corsOptions,
  securityHeaders,
  requestLogging,
  validateContentType,
  sanitizeInput,
  ipWhitelist
};
