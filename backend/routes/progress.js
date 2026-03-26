const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const { validateIntId, validatePagination, validateRating } = require('../middleware/validation');

router.get('/', protect, validatePagination, progressController.getUserProgress);

router.get('/stats', protect, progressController.getUserStats);

router.get('/:tutorialId', protect, validateIntId('tutorialId'), progressController.getTutorialProgress);

router.put('/:tutorialId/lessons/:lessonId', protect, validateIntId('tutorialId'), validateIntId('lessonId'), progressController.updateLessonProgress);

router.post('/:tutorialId/lessons/:lessonId/complete', protect, validateIntId('tutorialId'), validateIntId('lessonId'), progressController.markLessonCompleted);

router.post('/:tutorialId/rate', protect, validateIntId('tutorialId'), validateRating, progressController.rateTutorial);

router.post('/:tutorialId/reset', protect, validateIntId('tutorialId'), progressController.resetTutorialProgress);

module.exports = router;
