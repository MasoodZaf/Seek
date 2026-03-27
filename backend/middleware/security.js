const crypto = require('crypto');
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
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 300, // 300 requests
  'Too many requests from this IP, please try again later'
);

const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // 10 attempts per 15 minutes
  'Too many authentication attempts, please try again later',
  true // Skip successful requests
);

const codeExecutionRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  30, // 30 executions per minute
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

    // Allow requests with no origin (server-to-server, Postman) or from the whitelist
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
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

// Max characters per string field before sanitization runs.
// Caps CPU time regardless of regex complexity — prevents ReDoS via huge inputs.
const SANITIZE_MAX_FIELD_LEN = 100 * 1024; // 100 KB

// Code fields submitted to the execution endpoint are intentionally large and
// do NOT need HTML sanitization — skip them to avoid corrupting user code.
const SKIP_SANITIZE_KEYS = new Set(['code', 'solution', 'starterCode', 'content']);

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (SKIP_SANITIZE_KEYS.has(key)) return; // preserve code verbatim

      if (typeof obj[key] === 'string') {
        // Hard-cap length BEFORE any regex to prevent ReDoS on crafted inputs
        if (obj[key].length > SANITIZE_MAX_FIELD_LEN) {
          obj[key] = obj[key].slice(0, SANITIZE_MAX_FIELD_LEN);
        }

        obj[key] = obj[key].trim();

        // Safe linear replacements — no nested/catastrophic quantifiers
        // Strip <script …> … </script> blocks ([\s\S]*? is lazy but bounded by the length cap above)
        obj[key] = obj[key].replace(/<script[\s\S]*?<\/script>/gi, '');
        // Strip bare `javascript:` protocol
        obj[key] = obj[key].replace(/javascript\s*:/gi, '');
        // Strip inline event handlers (onclick=, onload=, etc.)
        obj[key] = obj[key].replace(/\bon\w+\s*=/gi, '');
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

// ── CSRF double-submit cookie ────────────────────────────────────────────────
// Safe methods (GET/HEAD/OPTIONS) get a fresh token cookie issued if absent.
// State-changing methods (POST/PUT/PATCH/DELETE) must echo the cookie value
// in the X-CSRF-Token header — something a cross-origin attacker cannot do.
const CSRF_COOKIE = 'csrf-token';
const CSRF_HEADER = 'x-csrf-token';
const CSRF_SAFE  = new Set(['GET', 'HEAD', 'OPTIONS']);

const csrfProtection = (req, res, next) => {
  if (CSRF_SAFE.has(req.method)) {
    // Issue token on first safe request
    if (!req.cookies[CSRF_COOKIE]) {
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,                                          // JS-readable so frontend can read it
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });
    }
    return next();
  }

  // If no CSRF cookie exists the request is not from a browser session (Postman, server-to-server) — allow
  if (!req.cookies[CSRF_COOKIE]) return next();

  const headerToken  = req.headers[CSRF_HEADER];
  const cookieToken  = req.cookies[CSRF_COOKIE];

  if (!headerToken || headerToken !== cookieToken) {
    logger.warn('CSRF token mismatch', { method: req.method, url: req.originalUrl, ip: req.ip });
    return res.status(403).json({ success: false, message: 'Invalid or missing CSRF token' });
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
  csrfProtection,
  ipWhitelist
};
