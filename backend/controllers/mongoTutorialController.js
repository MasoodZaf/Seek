// Note: validationResult import removed as it was unused
const MongoTutorial = require('../models/MongoTutorial');
const logger = require('../config/logger');

// Get all tutorials with filtering and pagination
const getTutorials = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      language,
      difficulty,
      featured,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (language) filter.language = language;
    if (difficulty) filter.difficulty = difficulty;
    if (featured === 'true') filter.isFeatured = true;

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Get tutorials with pagination
    const [tutorials, total] = await Promise.all([
      MongoTutorial.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .select('-steps -quiz'), // Exclude detailed content for list view
      MongoTutorial.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit, 10));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Tutorials retrieved successfully',
      data: {
        tutorials,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          category,
          language,
          difficulty,
          featured,
          search
        }
      }
    });
  } catch (error) {
    logger.error('Get tutorials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tutorials',
      error: error.message
    });
  }
};

// Get single tutorial by ID or slug
const getTutorial = async (req, res) => {
  try {
    const identifier = req.params.id;

    // Try to find by slug first, then by ObjectId
    let tutorial;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      tutorial = await MongoTutorial.findById(identifier);
    } else {
      // It's likely a slug
      tutorial = await MongoTutorial.findOne({ slug: identifier });
    }

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    if (!tutorial.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not available'
      });
    }

    // Increment view count
    await tutorial.incrementViews();

    res.status(200).json({
      success: true,
      message: 'Tutorial retrieved successfully',
      data: { tutorial }
    });
  } catch (error) {
    logger.error('Get tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tutorial',
      error: error.message
    });
  }
};

// Get tutorial categories with counts
const getCategories = async (req, res) => {
  try {
    const categories = await MongoTutorial.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: { categories }
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message
    });
  }
};

// Get programming languages with counts
const getLanguages = async (req, res) => {
  try {
    const languages = await MongoTutorial.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { language: '$_id', count: 1, _id: 0 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Languages retrieved successfully',
      data: { languages }
    });
  } catch (error) {
    logger.error('Get languages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve languages',
      error: error.message
    });
  }
};

// Get featured tutorials
const getFeaturedTutorials = async (req, res) => {
  try {
    const featured = await MongoTutorial.find({
      isFeatured: true,
      isPublished: true
    })
      .sort({ 'rating.average': -1 })
      .limit(6)
      .select('-steps -quiz');

    res.status(200).json({
      success: true,
      message: 'Featured tutorials retrieved successfully',
      data: { tutorials: featured }
    });
  } catch (error) {
    logger.error('Get featured tutorials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured tutorials',
      error: error.message
    });
  }
};

// Get popular tutorials (most viewed)
const getPopularTutorials = async (req, res) => {
  try {
    const popular = await MongoTutorial.find({ isPublished: true })
      .sort({ 'stats.views': -1 })
      .limit(10)
      .select('-steps -quiz');

    res.status(200).json({
      success: true,
      message: 'Popular tutorials retrieved successfully',
      data: { tutorials: popular }
    });
  } catch (error) {
    logger.error('Get popular tutorials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular tutorials',
      error: error.message
    });
  }
};

// Search tutorials
const searchTutorials = async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const tutorials = await MongoTutorial.search(query.trim())
      .limit(parseInt(limit, 10))
      .select('-steps -quiz');

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        tutorials,
        query: query.trim(),
        count: tutorials.length
      }
    });
  } catch (error) {
    logger.error('Search tutorials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search tutorials',
      error: error.message
    });
  }
};

// Get tutorial statistics
const getTutorialStats = async (req, res) => {
  try {
    const stats = await MongoTutorial.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: null,
          totalTutorials: { $sum: 1 },
          totalViews: { $sum: '$stats.views' },
          totalCompletions: { $sum: '$stats.completions' },
          averageRating: { $avg: '$rating.average' },
          totalRatings: { $sum: '$rating.count' }
        }
      }
    ]);

    const categoryStats = await MongoTutorial.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const difficultyStats = await MongoTutorial.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Tutorial statistics retrieved successfully',
      data: {
        overview: stats[0] || {
          totalTutorials: 0,
          totalViews: 0,
          totalCompletions: 0,
          averageRating: 0,
          totalRatings: 0
        },
        categories: categoryStats,
        difficulties: difficultyStats
      }
    });
  } catch (error) {
    logger.error('Get tutorial stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tutorial statistics',
      error: error.message
    });
  }
};

// Complete tutorial (mark as completed)
const completeTutorial = async (req, res) => {
  try {
    const tutorialId = req.params.id;
    // userId available from req.user.id if needed for user-specific logic

    const tutorial = await MongoTutorial.findById(tutorialId);
    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Increment completion count
    await tutorial.incrementCompletions();

    // Here you would typically also update user progress in SQLite
    // This is just updating the tutorial stats in MongoDB

    res.status(200).json({
      success: true,
      message: 'Tutorial marked as completed',
      data: {
        tutorialId,
        completions: tutorial.stats.completions + 1
      }
    });
  } catch (error) {
    logger.error('Complete tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete tutorial',
      error: error.message
    });
  }
};

// Rate tutorial
const rateTutorial = async (req, res) => {
  try {
    const tutorialId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const tutorial = await MongoTutorial.findById(tutorialId);
    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Update rating
    await tutorial.updateRating(rating);

    res.status(200).json({
      success: true,
      message: 'Tutorial rated successfully',
      data: {
        tutorialId,
        newAverage: tutorial.rating.average,
        totalRatings: tutorial.rating.count
      }
    });
  } catch (error) {
    logger.error('Rate tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate tutorial',
      error: error.message
    });
  }
};

module.exports = {
  getTutorials,
  getTutorial,
  getCategories,
  getLanguages,
  getFeaturedTutorials,
  getPopularTutorials,
  searchTutorials,
  getTutorialStats,
  completeTutorial,
  rateTutorial
};
