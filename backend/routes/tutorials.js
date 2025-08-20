const express = require('express');

const router = express.Router();

const tutorialController = require('../controllers/tutorialController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  validateTutorialCreation,
  validateLessonCreation,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

router.get('/', optionalAuth, validatePagination, tutorialController.getTutorials);

router.get('/:id', validateObjectId('id'), optionalAuth, tutorialController.getTutorial);

router.post('/', protect, authorize('instructor', 'admin'), validateTutorialCreation, tutorialController.createTutorial);

router.put('/:id', validateObjectId('id'), protect, authorize('instructor', 'admin'), tutorialController.updateTutorial);

router.delete('/:id', validateObjectId('id'), protect, authorize('instructor', 'admin'), tutorialController.deleteTutorial);

router.post('/:id/lessons', validateObjectId('id'), protect, authorize('instructor', 'admin'), validateLessonCreation, tutorialController.addLesson);

router.put('/:id/lessons/:lessonId', validateObjectId('id'), validateObjectId('lessonId'), protect, authorize('instructor', 'admin'), tutorialController.updateLesson);

router.delete('/:id/lessons/:lessonId', validateObjectId('id'), validateObjectId('lessonId'), protect, authorize('instructor', 'admin'), tutorialController.deleteLesson);

router.post('/:id/enroll', validateObjectId('id'), protect, tutorialController.enrollInTutorial);

router.get('/:id/lessons/:lessonId', validateObjectId('id'), validateObjectId('lessonId'), optionalAuth, tutorialController.getLesson);

module.exports = router;
