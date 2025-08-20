const express = require('express');

const router = express.Router();

const rateLimit = require('express-rate-limit');
const mongoTutorialController = require('../controllers/mongoTutorialController');
const { protect, optionalAuth } = require('../middleware/auth');

// Rate limiting for public endpoints
const publicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Rate limiting for user actions
const userActionRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each user to 10 actions per minute
  message: 'Too many actions, please slow down'
});

// Public routes (with rate limiting)
router.get('/', publicRateLimit, mongoTutorialController.getTutorials);
router.get('/featured', publicRateLimit, mongoTutorialController.getFeaturedTutorials);
router.get('/popular', publicRateLimit, mongoTutorialController.getPopularTutorials);
router.get('/categories', publicRateLimit, mongoTutorialController.getCategories);
router.get('/languages', publicRateLimit, mongoTutorialController.getLanguages);
router.get('/stats', publicRateLimit, mongoTutorialController.getTutorialStats);
router.get('/search', publicRateLimit, mongoTutorialController.searchTutorials);

// Debug route to test direct access (before /:id route)
router.get('/debug', publicRateLimit, async (req, res) => {
  try {
    const MongoTutorial = require('../models/MongoTutorial');
    const tutorials = await MongoTutorial.find({ isPublished: true }).limit(20);
    res.json({
      success: true,
      debug: true,
      count: tutorials.length,
      data: { tutorials }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Individual tutorial (increment view count)
router.get('/:id', publicRateLimit, mongoTutorialController.getTutorial);

// Protected routes (require authentication)
router.post('/:id/complete', protect, userActionRateLimit, mongoTutorialController.completeTutorial);
router.post('/:id/rate', protect, userActionRateLimit, mongoTutorialController.rateTutorial);

module.exports = router;
