const { Op } = require('sequelize');
const { Tutorial, UserProgress } = require('../models');
const logger = require('../config/logger');

const getTutorials = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      language,
      category,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isPublished: true };

    if (language) {
      where.language = language;
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const order = [[sortBy, sortOrder.toUpperCase()]];

    const { count: total, rows: tutorials } = await Tutorial.findAndCountAll({
      where,
      order,
      offset,
      limit: parseInt(limit, 10)
    });

    // Add author information and parse JSON fields
    const tutorialsWithAuthor = tutorials.map((tutorial) => {
      const tutorialData = tutorial.toJSON();

      // Parse JSON fields if they're strings
      if (tutorialData.lessons && typeof tutorialData.lessons === 'string') {
        tutorialData.lessons = JSON.parse(tutorialData.lessons);
      }
      if (tutorialData.stats && typeof tutorialData.stats === 'string') {
        tutorialData.stats = JSON.parse(tutorialData.stats);
      }

      // Add author information (we'll get this from the user later, for now use default)
      tutorialData.author = {
        name: 'Seek Team',
        avatar: null
      };

      // Add lessons count for convenience
      tutorialData.lessonsCount = Array.isArray(tutorialData.lessons) ? tutorialData.lessons.length : 0;

      return tutorialData;
    });

    res.status(200).json({
      success: true,
      data: {
        tutorials: tutorialsWithAuthor,
        pagination: {
          total,
          page: parseInt(page, 10),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    logger.error('Get tutorials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutorials'
    });
  }
};

const getTutorial = async (req, res) => {
  try {
    const { id } = req.params;

    const tutorial = await Tutorial.findByPk(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Parse JSON fields if they exist
    const tutorialData = tutorial.toJSON();
    if (tutorialData.lessons && typeof tutorialData.lessons === 'string') {
      tutorialData.lessons = JSON.parse(tutorialData.lessons);
    }
    if (tutorialData.author && typeof tutorialData.author === 'string') {
      tutorialData.author = JSON.parse(tutorialData.author);
    }
    if (tutorialData.stats && typeof tutorialData.stats === 'string') {
      tutorialData.stats = JSON.parse(tutorialData.stats);
    }

    // Add enrollment status for the user
    tutorialData.enrolled = false;
    tutorialData.progress = 0;

    // For now, mock some progress data
    if (req.user) {
      // This would come from a user_progress table in a real implementation
      tutorialData.enrolled = Math.random() > 0.7; // Simulate 30% enrollment
      if (tutorialData.enrolled) {
        tutorialData.progress = Math.floor(Math.random() * 100);
      }
    }

    res.status(200).json({
      success: true,
      data: tutorialData
    });
  } catch (error) {
    logger.error('Get tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutorial'
    });
  }
};

const createTutorial = async (req, res) => {
  try {
    const tutorialData = {
      ...req.body,
      author: req.user.id
    };

    const tutorial = await Tutorial.create(tutorialData);

    const populatedTutorial = await Tutorial.findById(tutorial._id)
      .populate('author', 'username firstName lastName');

    logger.info(`Tutorial created: ${tutorial.title} by ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Tutorial created successfully',
      data: populatedTutorial
    });
  } catch (error) {
    logger.error('Create tutorial error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create tutorial'
    });
  }
};

const updateTutorial = async (req, res) => {
  try {
    const { id } = req.params;

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this tutorial'
      });
    }

    const updatedTutorial = await Tutorial.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    logger.info(`Tutorial updated: ${updatedTutorial.title} by ${req.user.username}`);

    res.status(200).json({
      success: true,
      message: 'Tutorial updated successfully',
      data: updatedTutorial
    });
  } catch (error) {
    logger.error('Update tutorial error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update tutorial'
    });
  }
};

const deleteTutorial = async (req, res) => {
  try {
    const { id } = req.params;

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this tutorial'
      });
    }

    await Tutorial.findByIdAndDelete(id);
    await UserProgress.deleteMany({ tutorial: id });

    logger.info(`Tutorial deleted: ${tutorial.title} by ${req.user.username}`);

    res.status(200).json({
      success: true,
      message: 'Tutorial deleted successfully'
    });
  } catch (error) {
    logger.error('Delete tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tutorial'
    });
  }
};

const addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lessonData = req.body;

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this tutorial'
      });
    }

    tutorial.lessons.push(lessonData);
    await tutorial.save();

    const addedLesson = tutorial.lessons[tutorial.lessons.length - 1];

    logger.info(`Lesson added to tutorial: ${tutorial.title}`);

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: addedLesson
    });
  } catch (error) {
    logger.error('Add lesson error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add lesson'
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const lessonData = req.body;

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this tutorial'
      });
    }

    const lesson = tutorial.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    Object.assign(lesson, lessonData);
    await tutorial.save();

    logger.info(`Lesson updated in tutorial: ${tutorial.title}`);

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    logger.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson'
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    if (tutorial.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this tutorial'
      });
    }

    tutorial.lessons.id(lessonId).remove();
    await tutorial.save();

    logger.info(`Lesson deleted from tutorial: ${tutorial.title}`);

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    logger.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson'
    });
  }
};

const enrollInTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tutorial = await Tutorial.findByPk(id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // For now, just return success - in a full implementation, you'd create user progress records
    logger.info(`User enrolled in tutorial: ${req.user.username || req.user.email} -> ${tutorial.title}`);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in tutorial',
      data: {
        tutorialId: id,
        userId,
        status: 'in_progress',
        progress: 0
      }
    });
  } catch (error) {
    logger.error('Enroll in tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in tutorial'
    });
  }
};

const getLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const userId = req.user?.id;

    const tutorial = await Tutorial.findOne({
      _id: id,
      isPublished: true
    });

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    const lesson = tutorial.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    let userProgress = null;
    if (userId) {
      userProgress = await UserProgress.findOne({
        user: userId,
        tutorial: id
      });
    }

    const lessonProgress = userProgress
      ? userProgress.lessonsProgress.find(
        (lp) => lp.lessonId.toString() === lessonId
      )
      : null;

    res.status(200).json({
      success: true,
      data: {
        lesson,
        tutorial: {
          _id: tutorial._id,
          title: tutorial.title,
          language: tutorial.language
        },
        progress: lessonProgress ? {
          status: lessonProgress.status,
          attempts: lessonProgress.attempts,
          bestScore: lessonProgress.bestScore,
          timeSpent: lessonProgress.timeSpent,
          completedAt: lessonProgress.completedAt
        } : null
      }
    });
  } catch (error) {
    logger.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson'
    });
  }
};

module.exports = {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  addLesson,
  updateLesson,
  deleteLesson,
  enrollInTutorial,
  getLesson
};
