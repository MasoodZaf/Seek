const express = require('express');

const router = express.Router();

const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const {
  validateObjectId,
  validatePagination,
  validateRating
} = require('../middleware/validation');

router.get('/', protect, validatePagination, progressController.getUserProgress);

router.get('/stats', protect, progressController.getUserStats);

router.get('/:tutorialId', validateObjectId('tutorialId'), protect, progressController.getTutorialProgress);

router.put('/:tutorialId/lessons/:lessonId', validateObjectId('tutorialId'), validateObjectId('lessonId'), protect, progressController.updateLessonProgress);

router.post('/:tutorialId/lessons/:lessonId/complete', validateObjectId('tutorialId'), validateObjectId('lessonId'), protect, progressController.markLessonCompleted);

router.post('/:tutorialId/rate', validateObjectId('tutorialId'), protect, validateRating, progressController.rateTutorial);

router.post('/:tutorialId/reset', validateObjectId('tutorialId'), protect, progressController.resetTutorialProgress);

module.exports = router;
