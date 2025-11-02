const { checkAIUsageLimit } = require('../middleware/aiRateLimit');

// Mock dependencies
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

const { User } = require('../models');
const logger = require('../config/logger');

describe('AI Rate Limiting Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 1, username: 'testuser' },
      aiUsage: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('checkAIUsageLimit', () => {
    it('should allow request when under limit', async () => {
      const mockUser = {
        id: 1,
        aiRequestsThisMonth: 10,
        aiRequestsLimit: 50,
        aiRequestsResetDate: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findByPk.mockResolvedValue(mockUser);

      await checkAIUsageLimit(req, res, next);

      expect(mockUser.aiRequestsThisMonth).toBe(11);
      expect(mockUser.save).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should block request when limit exceeded', async () => {
      const mockUser = {
        id: 1,
        aiRequestsThisMonth: 50,
        aiRequestsLimit: 50,
        aiRequestsResetDate: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findByPk.mockResolvedValue(mockUser);

      await checkAIUsageLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          code: 'AI_LIMIT_EXCEEDED'
        })
      );
      expect(next).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should reset counter at start of new month', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const mockUser = {
        id: 1,
        aiRequestsThisMonth: 50,
        aiRequestsLimit: 50,
        aiRequestsResetDate: lastMonth,
        save: jest.fn().mockResolvedValue(true)
      };

      User.findByPk.mockResolvedValue(mockUser);

      await checkAIUsageLimit(req, res, next);

      expect(mockUser.aiRequestsThisMonth).toBe(1); // Reset to 0 then incremented
      expect(mockUser.save).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Reset AI request counter'));
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = null;

      await checkAIUsageLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Authentication required for AI features'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await checkAIUsageLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'User not found'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await checkAIUsageLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Failed to check AI usage limit'
        })
      );
      expect(logger.error).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should add usage info to request', async () => {
      const mockUser = {
        id: 1,
        aiRequestsThisMonth: 25,
        aiRequestsLimit: 50,
        aiRequestsResetDate: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findByPk.mockResolvedValue(mockUser);

      await checkAIUsageLimit(req, res, next);

      expect(req.aiUsage).toBeDefined();
      expect(req.aiUsage.requestsUsed).toBe(26);
      expect(req.aiUsage.limit).toBe(50);
      expect(req.aiUsage.remaining).toBe(24);
    });
  });
});
