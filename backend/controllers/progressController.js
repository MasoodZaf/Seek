const { UserProgress, Tutorial } = require('../models');
const logger = require('../config/logger');

const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (page - 1) * limit;
    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    const progressList = await UserProgress.find(query)
      .populate('tutorial', 'title description difficulty language thumbnail')
      .sort({ lastAccessedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await UserProgress.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        progress: progressList,
        pagination: {
          total,
          page: parseInt(page, 10),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    logger.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user progress'
    });
  }
};

const getTutorialProgress = async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const userId = req.user.id;

    const progress = await UserProgress.findOne({
      user: userId,
      tutorial: tutorialId
    }).populate('tutorial', 'title description lessons');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this tutorial'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    logger.error('Get tutorial progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutorial progress'
    });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const { tutorialId, lessonId } = req.params;
    const {
      status, timeSpent = 0, submittedCode = '', score = 0
    } = req.body;
    const userId = req.user.id;

    const progress = await UserProgress.findOne({
      user: userId,
      tutorial: tutorialId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this tutorial'
      });
    }

    const progressData = {
      status,
      timeSpent: (progress.lessonsProgress.find((l) => l.lessonId.toString() === lessonId)?.timeSpent || 0) + timeSpent,
      submittedCode,
      lastAttemptAt: new Date()
    };

    if (status === 'completed') {
      progressData.completedAt = new Date();
      progressData.bestScore = Math.max(
        score,
        progress.lessonsProgress.find((l) => l.lessonId.toString() === lessonId)?.bestScore || 0
      );
    }

    const lessonProgress = progress.lessonsProgress.find((l) => l.lessonId.toString() === lessonId);
    progressData.attempts = (lessonProgress?.attempts || 0) + 1;

    await progress.updateLessonProgress(lessonId, progressData);

    if (status === 'completed') {
      const tutorial = await Tutorial.findById(tutorialId);
      const lessonIndex = tutorial.lessons.findIndex((l) => l._id.toString() === lessonId);

      if (lessonIndex < tutorial.lessons.length - 1) {
        progress.currentLesson = lessonIndex + 1;
        await progress.save();
      }

      if (progress.overallProgress === 100) {
        await tutorial.incrementCompletion();

        progress.certificate = {
          issued: true,
          issuedAt: new Date(),
          certificateId: `SEEK-${tutorialId}-${userId}-${Date.now()}`
        };
        await progress.save();
      }
    }

    logger.info(`Lesson progress updated: ${req.user.username} - Tutorial ${tutorialId} - Lesson ${lessonId}`);

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully',
      data: progress
    });
  } catch (error) {
    logger.error('Update lesson progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson progress'
    });
  }
};

const markLessonCompleted = async (req, res) => {
  try {
    const { tutorialId, lessonId } = req.params;
    const { submittedCode = '', score = 100 } = req.body;
    const userId = req.user.id;

    const progress = await UserProgress.findOne({
      user: userId,
      tutorial: tutorialId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this tutorial'
      });
    }

    await progress.markLessonCompleted(lessonId, submittedCode, score);

    const tutorial = await Tutorial.findById(tutorialId);
    const lessonIndex = tutorial.lessons.findIndex((l) => l._id.toString() === lessonId);

    if (lessonIndex < tutorial.lessons.length - 1) {
      progress.currentLesson = lessonIndex + 1;
      await progress.save();
    }

    if (progress.overallProgress === 100) {
      await tutorial.incrementCompletion();

      progress.certificate = {
        issued: true,
        issuedAt: new Date(),
        certificateId: `SEEK-${tutorialId}-${userId}-${Date.now()}`
      };
      await progress.save();
    }

    logger.info(`Lesson completed: ${req.user.username} - Tutorial ${tutorialId} - Lesson ${lessonId}`);

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      data: {
        progress,
        certificateIssued: progress.certificate.issued && progress.overallProgress === 100
      }
    });
  } catch (error) {
    logger.error('Mark lesson completed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark lesson as completed'
    });
  }
};

const rateTutorial = async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const { score, review } = req.body;
    const userId = req.user.id;

    const progress = await UserProgress.findOne({
      user: userId,
      tutorial: tutorialId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this tutorial'
      });
    }

    if (progress.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Tutorial must be completed before rating'
      });
    }

    if (progress.rating.score) {
      return res.status(409).json({
        success: false,
        message: 'Tutorial already rated'
      });
    }

    await progress.addRating(score, review);

    const tutorial = await Tutorial.findById(tutorialId);
    await tutorial.updateRating(score);

    logger.info(`Tutorial rated: ${req.user.username} - ${tutorial.title} - ${score}/5`);

    res.status(200).json({
      success: true,
      message: 'Tutorial rated successfully',
      data: progress.rating
    });
  } catch (error) {
    logger.error('Rate tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate tutorial'
    });
  }
};

const resetTutorialProgress = async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const userId = req.user.id;

    const progress = await UserProgress.findOne({
      user: userId,
      tutorial: tutorialId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this tutorial'
      });
    }

    progress.lessonsProgress.forEach((lesson) => {
      lesson.status = 'not_started';
      lesson.attempts = 0;
      lesson.bestScore = 0;
      lesson.timeSpent = 0;
      lesson.hintsUsed = 0;
      lesson.lastAttemptAt = null;
      lesson.completedAt = null;
      lesson.submittedCode = '';
    });

    progress.status = 'in_progress';
    progress.currentLesson = 0;
    progress.overallProgress = 0;
    progress.totalTimeSpent = 0;
    progress.totalAttempts = 0;
    progress.averageScore = 0;
    progress.completedAt = null;
    progress.certificate = {
      issued: false,
      issuedAt: null,
      certificateId: null
    };

    await progress.save();

    logger.info(`Tutorial progress reset: ${req.user.username} - Tutorial ${tutorialId}`);

    res.status(200).json({
      success: true,
      message: 'Tutorial progress reset successfully',
      data: progress
    });
  } catch (error) {
    logger.error('Reset tutorial progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset tutorial progress'
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await UserProgress.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalTutorials: { $sum: 1 },
          completedTutorials: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgressTutorials: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          totalTimeSpent: { $sum: '$totalTimeSpent' },
          averageScore: { $avg: '$averageScore' },
          totalCertificates: {
            $sum: { $cond: ['$certificate.issued', 1, 0] }
          }
        }
      }
    ]);

    const userStats = stats[0] || {
      totalTutorials: 0,
      completedTutorials: 0,
      inProgressTutorials: 0,
      totalTimeSpent: 0,
      averageScore: 0,
      totalCertificates: 0
    };

    userStats.completionRate = userStats.totalTutorials > 0
      ? Math.round((userStats.completedTutorials / userStats.totalTutorials) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: userStats
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};

module.exports = {
  getUserProgress,
  getTutorialProgress,
  updateLessonProgress,
  markLessonCompleted,
  rateTutorial,
  resetTutorialProgress,
  getUserStats
};
