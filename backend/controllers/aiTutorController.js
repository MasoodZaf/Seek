const { validationResult } = require('express-validator');
const aiTutorService = require('../services/aiTutorService');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const logger = require('../config/logger');

class AITutorController {
  async chat(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { message, context = {} } = req.body;
      const userId = req.user.id;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      if (message.length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'Message too long. Please keep it under 2000 characters.'
        });
      }

      context.userId = userId;
      context.sessionId = context.sessionId || `chat_${Date.now()}`;

      const result = await aiTutorService.getChatResponse(userId, message, context);

      if (result.success) {
        await this.logUserInteraction(userId, 'chat', { message, response: result.response });

        res.json({
          success: true,
          data: {
            response: result.response,
            context: result.context,
            sessionId: context.sessionId,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'AI tutor is temporarily unavailable',
          data: {
            response: result.response,
            fallback: true
          }
        });
      }
    } catch (error) {
      logger.error('AI Tutor chat error:', { error: error.message, userId: req.user?.id });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: {
          response: "I'm sorry, I'm having technical difficulties. Please try again in a moment.",
          fallback: true
        }
      });
    }
  }

  async reviewCode(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { code, language, exerciseContext = {} } = req.body;
      const userId = req.user.id;

      if (!code || !language) {
        return res.status(400).json({
          success: false,
          message: 'Code and language are required'
        });
      }

      if (code.length > 5000) {
        return res.status(400).json({
          success: false,
          message: 'Code too long. Please keep it under 5000 characters for review.'
        });
      }

      const supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'c', 'typescript'];
      if (!supportedLanguages.includes(language.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Language ${language} is not supported for code review`
        });
      }

      const result = await aiTutorService.reviewCode(
        userId,
        code,
        language.toLowerCase(),
        exerciseContext
      );

      if (result.success) {
        await this.logUserInteraction(userId, 'code_review', {
          language,
          codeLength: code.length,
          score: result.score
        });

        await this.updateUserProgress(userId, 'code_reviews', result.score);

        res.json({
          success: true,
          data: {
            review: result.response,
            score: result.score,
            suggestions: result.suggestions || [],
            strengths: result.strengths || [],
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Code review service temporarily unavailable',
          data: {
            review: result.response,
            fallback: true
          }
        });
      }
    } catch (error) {
      logger.error('AI code review error:', { error: error.message, userId: req.user?.id });

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getHint(req, res) {
    try {
      const {
        exerciseId, code, attemptCount = 1, difficulty = 'beginner'
      } = req.body;
      const userId = req.user.id;

      if (!exerciseId) {
        return res.status(400).json({
          success: false,
          message: 'Exercise ID is required'
        });
      }

      const result = await aiTutorService.getHint(
        userId,
        exerciseId,
        code || '',
        attemptCount,
        difficulty
      );

      if (result.success) {
        await this.logUserInteraction(userId, 'hint_request', {
          exerciseId,
          attemptCount,
          hintLevel: result.hintLevel
        });

        res.json({
          success: true,
          data: {
            hint: result.response,
            hintLevel: result.hintLevel,
            attemptCount: result.attemptCount,
            nextHintAvailable: result.nextHintAvailable,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Hint service temporarily unavailable',
          data: {
            hint: result.response,
            fallback: true
          }
        });
      }
    } catch (error) {
      logger.error('AI hint error:', { error: error.message, userId: req.user?.id });

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async debugCode(req, res) {
    try {
      const {
        code, language, errorMessage, stackTrace
      } = req.body;
      const userId = req.user.id;

      if (!code || !language || !errorMessage) {
        return res.status(400).json({
          success: false,
          message: 'Code, language, and error message are required'
        });
      }

      const result = await aiTutorService.debugCode(
        userId,
        code,
        language,
        errorMessage,
        stackTrace
      );

      if (result.success) {
        await this.logUserInteraction(userId, 'debug_help', {
          language,
          errorType: result.errorType
        });

        res.json({
          success: true,
          data: {
            explanation: result.response,
            errorType: result.errorType,
            fixes: result.fixes || [],
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Debug assistance temporarily unavailable',
          data: {
            explanation: result.response,
            fallback: true
          }
        });
      }
    } catch (error) {
      logger.error('AI debug error:', { error: error.message, userId: req.user?.id });

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async generatePersonalizedExercise(req, res) {
    try {
      const userId = req.user.id;

      const userProgress = await UserProgress.findOne({
        where: { userId }
      });

      const user = await User.findByPk(userId);

      const userProfile = {
        level: user?.progress?.level || 'beginner',
        language: user?.preferences?.language || 'javascript',
        completedTopics: userProgress?.completedTopics || [],
        strengths: userProgress?.strengths || [],
        weaknesses: userProgress?.weaknesses || [],
        learningStyle: user?.preferences?.learningStyle || 'practical'
      };

      const result = await aiTutorService.generatePersonalizedExercise(userId, userProfile);

      if (result.success) {
        await this.logUserInteraction(userId, 'personalized_exercise', {
          userLevel: userProfile.level,
          language: userProfile.language
        });

        res.json({
          success: true,
          data: {
            exercise: result.exercise,
            personalized: true,
            targetSkills: result.targetSkills,
            generatedFor: userProfile,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Exercise generation temporarily unavailable'
        });
      }
    } catch (error) {
      logger.error('Personalized exercise error:', { error: error.message, userId: req.user?.id });

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async clearConversation(req, res) {
    try {
      const { sessionId } = req.body;
      const userId = req.user.id;

      aiTutorService.clearConversationContext(userId, sessionId);

      res.json({
        success: true,
        message: 'Conversation context cleared',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Clear conversation error:', { error: error.message, userId: req.user?.id });

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getStats(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const stats = {
        activeConversations: aiTutorService.getActiveConversations(),
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('AI Tutor stats error:', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async logUserInteraction(userId, action, metadata = {}) {
    try {
      logger.info(`AI Tutor interaction: ${action}`, {
        userId,
        action,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to log user interaction:', { error: error.message, userId });
    }
  }

  async updateUserProgress(userId, activity, score = null) {
    try {
      let userProgress = await UserProgress.findOne({
        where: { userId }
      });

      if (!userProgress) {
        userProgress = await UserProgress.create({
          userId,
          completedExercises: [],
          totalExercises: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalPoints: 0,
          level: 1
        });
      }

      const updates = {
        lastActivityAt: new Date(),
        totalInteractions: (userProgress.totalInteractions || 0) + 1
      };

      if (activity === 'code_reviews') {
        updates.totalCodeReviews = (userProgress.totalCodeReviews || 0) + 1;

        if (score && score.overall) {
          updates.averageScore = userProgress.averageScore
            ? (userProgress.averageScore + score.overall) / 2
            : score.overall;
        }
      }

      await userProgress.update(updates);
    } catch (error) {
      logger.error('Failed to update user progress:', { error: error.message, userId });
    }
  }
}

module.exports = new AITutorController();
