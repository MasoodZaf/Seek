const { User } = require('../models');
const logger = require('../config/logger');

/**
 * Middleware to check and enforce AI usage limits per user
 */
const checkAIUsageLimit = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for AI features'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if we need to reset the monthly counter
    const now = new Date();
    const resetDate = user.aiRequestsResetDate ? new Date(user.aiRequestsResetDate) : null;

    // Reset if it's a new month or first time using
    if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
      user.aiRequestsThisMonth = 0;
      user.aiRequestsResetDate = now;
      await user.save();
      logger.info(`Reset AI request counter for user ${user.id}`);
    }

    // Check if user has exceeded their limit
    if (user.aiRequestsThisMonth >= user.aiRequestsLimit) {
      logger.warn(`AI usage limit exceeded for user ${user.id}`, {
        userId: user.id,
        username: user.username,
        requests: user.aiRequestsThisMonth,
        limit: user.aiRequestsLimit
      });

      return res.status(429).json({
        success: false,
        message: `Monthly AI request limit reached (${user.aiRequestsLimit} requests). Limit resets next month.`,
        code: 'AI_LIMIT_EXCEEDED',
        data: {
          requestsUsed: user.aiRequestsThisMonth,
          limit: user.aiRequestsLimit,
          resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
        }
      });
    }

    // Increment the counter
    user.aiRequestsThisMonth += 1;
    await user.save();

    // Add usage info to response
    req.aiUsage = {
      requestsUsed: user.aiRequestsThisMonth,
      limit: user.aiRequestsLimit,
      remaining: user.aiRequestsLimit - user.aiRequestsThisMonth
    };

    logger.info(`AI request for user ${user.id}`, {
      userId: user.id,
      username: user.username,
      requestsUsed: user.aiRequestsThisMonth,
      remaining: user.aiRequestsLimit - user.aiRequestsThisMonth
    });

    next();
  } catch (error) {
    logger.error('AI rate limit check failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check AI usage limit'
    });
  }
};

/**
 * Middleware to add AI usage info to successful responses
 */
const addAIUsageInfo = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    if (req.aiUsage && data && typeof data === 'object') {
      data.aiUsage = req.aiUsage;
    }
    return originalJson(data);
  };

  next();
};

module.exports = {
  checkAIUsageLimit,
  addAIUsageInfo
};
