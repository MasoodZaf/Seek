const express = require('express');
const { body } = require('express-validator');
const aiTutorController = require('../controllers/aiTutorController');
const auth = require('../middleware/auth');

const router = express.Router();

// Chat with AI tutor
router.post(
  '/chat',
  auth,
  [
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 2000 })
      .withMessage('Message must be less than 2000 characters'),
    body('context.type')
      .optional()
      .isIn(['general', 'codeReview', 'debugging', 'hints'])
      .withMessage('Invalid context type'),
    body('context.sessionId')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Session ID too long')
  ],
  aiTutorController.chat
);

// Get code review from AI
router.post(
  '/review',
  auth,
  [
    body('code')
      .notEmpty()
      .withMessage('Code is required')
      .isLength({ max: 5000 })
      .withMessage('Code must be less than 5000 characters'),
    body('language')
      .notEmpty()
      .withMessage('Language is required')
      .isIn(['javascript', 'python', 'java', 'cpp', 'c', 'typescript'])
      .withMessage('Unsupported programming language'),
    body('exerciseContext.exerciseId')
      .optional()
      .isString()
      .withMessage('Exercise ID must be a string'),
    body('exerciseContext.difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level')
  ],
  aiTutorController.reviewCode
);

// Get hints for exercise
router.post(
  '/hint',
  auth,
  [
    body('exerciseId')
      .notEmpty()
      .withMessage('Exercise ID is required'),
    body('code')
      .optional()
      .isLength({ max: 3000 })
      .withMessage('Code must be less than 3000 characters'),
    body('attemptCount')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Attempt count must be between 1 and 10'),
    body('difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level')
  ],
  aiTutorController.getHint
);

// Get debugging help
router.post(
  '/debug',
  auth,
  [
    body('code')
      .notEmpty()
      .withMessage('Code is required')
      .isLength({ max: 5000 })
      .withMessage('Code must be less than 5000 characters'),
    body('language')
      .notEmpty()
      .withMessage('Language is required')
      .isIn(['javascript', 'python', 'java', 'cpp', 'c', 'typescript'])
      .withMessage('Unsupported programming language'),
    body('errorMessage')
      .notEmpty()
      .withMessage('Error message is required')
      .isLength({ max: 1000 })
      .withMessage('Error message too long'),
    body('stackTrace')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Stack trace too long')
  ],
  aiTutorController.debugCode
);

// Generate personalized exercise
router.post(
  '/exercise/personalized',
  auth,
  aiTutorController.generatePersonalizedExercise
);

// Clear conversation context
router.post(
  '/conversation/clear',
  auth,
  [
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID must be a string')
  ],
  aiTutorController.clearConversation
);

// Get AI tutor stats (admin only)
router.get(
  '/stats',
  auth,
  aiTutorController.getStats
);

module.exports = router;
