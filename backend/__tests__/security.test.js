const {
  sanitizeInput,
  validateContentType,
  securityHeaders
} = require('../middleware/security');

describe('Security Middleware', () => {
  describe('sanitizeInput', () => {
    it('should remove script tags from input', () => {
      const req = {
        body: {
          name: 'John<script>alert("xss")</script>Doe'
        },
        query: {}
      };
      const res = {};
      const next = jest.fn();

      sanitizeInput(req, res, next);

      expect(req.body.name).not.toContain('<script>');
      expect(req.body.name).toBe('JohnDoe');
      expect(next).toHaveBeenCalled();
    });

    it('should remove javascript: protocol', () => {
      const req = {
        body: {
          url: 'javascript:alert(1)'
        },
        query: {}
      };
      const res = {};
      const next = jest.fn();

      sanitizeInput(req, res, next);

      expect(req.body.url).not.toContain('javascript:');
      expect(next).toHaveBeenCalled();
    });

    it('should remove event handlers', () => {
      const req = {
        body: {
          html: '<img src=x onerror=alert(1)>'
        },
        query: {}
      };
      const res = {};
      const next = jest.fn();

      sanitizeInput(req, res, next);

      expect(req.body.html).not.toContain('onerror');
      expect(next).toHaveBeenCalled();
    });

    it('should trim whitespace', () => {
      const req = {
        body: {
          username: '  testuser  '
        },
        query: {}
      };
      const res = {};
      const next = jest.fn();

      sanitizeInput(req, res, next);

      expect(req.body.username).toBe('testuser');
      expect(next).toHaveBeenCalled();
    });

    it('should handle nested objects', () => {
      const req = {
        body: {
          user: {
            name: '<script>alert(1)</script>John'
          }
        },
        query: {}
      };
      const res = {};
      const next = jest.fn();

      sanitizeInput(req, res, next);

      expect(req.body.user.name).not.toContain('<script>');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateContentType', () => {
    it('should allow application/json for POST requests', () => {
      const req = {
        method: 'POST',
        is: jest.fn((type) => type === 'application/json')
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateContentType(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow multipart/form-data for POST requests', () => {
      const req = {
        method: 'POST',
        is: jest.fn((type) => type === 'multipart/form-data')
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateContentType(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid content type for POST', () => {
      const req = {
        method: 'POST',
        is: jest.fn(() => false)
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateContentType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Invalid Content-Type')
        })
      );
    });

    it('should allow GET requests without validation', () => {
      const req = {
        method: 'GET'
      };
      const res = {};
      const next = jest.fn();

      validateContentType(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('securityHeaders', () => {
    it('should set all security headers', () => {
      const req = {};
      const res = {
        setHeader: jest.fn()
      };
      const next = jest.fn();

      // Set production environment for testing
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      securityHeaders(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin');
      expect(res.setHeader).toHaveBeenCalledWith('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      expect(res.setHeader).toHaveBeenCalledWith('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      expect(next).toHaveBeenCalled();

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });
  });
});
