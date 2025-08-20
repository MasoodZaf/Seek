const {
  body, param, query, validationResult
} = require('express-validator');
const logger = require('../config/logger');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    logger.warn('Validation errors:', { errors: errorMessages, path: req.path });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  next();
};

const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and cannot exceed 50 characters'),

  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and cannot exceed 50 characters'),

  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

const validateCodeExecution = [
  body('code')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Code is required and cannot exceed 10000 characters'),

  body('language')
    .isIn(['javascript', 'python', 'java', 'typescript', 'cpp', 'c', 'gml'])
    .withMessage('Invalid programming language'),

  body('input')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Input cannot exceed 1000 characters'),

  handleValidationErrors
];

const validateTutorialCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),

  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description is required and cannot exceed 1000 characters'),

  body('language')
    .isIn(['javascript', 'python', 'java', 'typescript', 'cpp', 'c', 'gml'])
    .withMessage('Invalid programming language'),

  body('category')
    .isIn(['fundamentals', 'web-development', 'data-structures', 'algorithms', 'frameworks'])
    .withMessage('Invalid category'),

  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),

  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters'),

  handleValidationErrors
];

const validateLessonCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Lesson title is required and cannot exceed 200 characters'),

  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Lesson description is required and cannot exceed 1000 characters'),

  body('content')
    .notEmpty()
    .withMessage('Lesson content is required'),

  body('order')
    .isInt({ min: 0 })
    .withMessage('Lesson order must be a positive integer'),

  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),

  body('estimatedTime')
    .optional()
    .isInt({ min: 1, max: 180 })
    .withMessage('Estimated time must be between 1 and 180 minutes'),

  handleValidationErrors
];

const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),

  handleValidationErrors
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('preferences.language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'typescript', 'cpp', 'c', 'gml'])
    .withMessage('Invalid programming language preference'),

  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Invalid theme preference'),

  handleValidationErrors
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

  handleValidationErrors
];

const validateRating = [
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating score must be between 1 and 5'),

  body('review')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters'),

  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateCodeExecution,
  validateTutorialCreation,
  validateLessonCreation,
  validateObjectId,
  validatePagination,
  validateUserUpdate,
  validatePasswordChange,
  validateRating
};
