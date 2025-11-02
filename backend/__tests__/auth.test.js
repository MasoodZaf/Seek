const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Mock logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Authentication Middleware', () => {
  let app;
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'student'
  };

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock User model
    const User = {
      findByPk: jest.fn()
    };

    // Replace the User import in middleware
    jest.mock('../models', () => ({
      User
    }));

    // Protected route
    app.get('/protected', protect, (req, res) => {
      res.json({
        success: true,
        user: req.user
      });
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate valid JWT token', () => {
      const payload = { id: 1, username: 'testuser' };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '1h'
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      expect(decoded.id).toBe(1);
      expect(decoded.username).toBe('testuser');
    });

    it('should reject expired tokens', () => {
      const payload = { id: 1, username: 'testuser' };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '0s' // Expired immediately
      });

      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      }).toThrow();
    });

    it('should reject tokens with invalid signature', () => {
      const payload = { id: 1, username: 'testuser' };
      const token = jwt.sign(payload, 'wrong-secret', {
        expiresIn: '1h'
      });

      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      }).toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords correctly', async () => {
      const password = 'testpassword123';
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(50);
    });

    it('should verify correct password', async () => {
      const password = 'testpassword123';
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);

      const isValid = await bcrypt.compare(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);

      const isValid = await bcrypt.compare(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });
  });

  describe('Token-based Authentication', () => {
    it('should accept valid bearer token', () => {
      const token = jwt.sign(mockUser, process.env.JWT_SECRET || 'test-secret');

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      expect(decoded.id).toBe(mockUser.id);
    });

    it('should extract user from token', () => {
      const token = jwt.sign(mockUser, process.env.JWT_SECRET || 'test-secret');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');

      expect(decoded).toMatchObject({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role
      });
    });
  });
});
