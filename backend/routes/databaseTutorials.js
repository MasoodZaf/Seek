const express = require('express');
const router = express.Router();
const DatabaseTutorial = require('../models/DatabaseTutorial');

// GET /api/v1/database-tutorials - Get all database tutorials
router.get('/', async (req, res) => {
  try {
    const {
      difficulty,
      language,
      search,
      limit = 50,
      page = 1,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Apply filters
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (language && language !== 'all') {
      query.language = language;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sorting
    const sortOption = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (page - 1) * parseInt(limit);

    const tutorials = await DatabaseTutorial.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-quizQuestions'); // Exclude quiz questions from list

    const total = await DatabaseTutorial.countDocuments(query);

    res.json({
      success: true,
      data: tutorials,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get database tutorials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch database tutorials',
      error: error.message
    });
  }
});

// GET /api/v1/database-tutorials/databases - Get available databases
router.get('/databases', async (req, res) => {
  try {
    const databases = await DatabaseTutorial.distinct('tags');
    // Extract main database names (MongoDB, SQL, PostgreSQL, Redis, MySQL)
    const dbNames = [...new Set(databases
      .filter(tag => ['MongoDB', 'SQL', 'PostgreSQL', 'Redis', 'MySQL'].includes(tag))
    )];

    res.json({
      success: true,
      data: dbNames.sort()
    });
  } catch (error) {
    console.error('Get databases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch databases',
      error: error.message
    });
  }
});

// GET /api/v1/database-tutorials/stats - Get database tutorials statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await DatabaseTutorial.countDocuments();

    const byDifficulty = await DatabaseTutorial.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const byDatabase = await DatabaseTutorial.aggregate([
      { $unwind: '$tags' },
      {
        $match: {
          tags: { $in: ['MongoDB', 'SQL', 'PostgreSQL', 'Redis', 'MySQL'] }
        }
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        byDifficulty: byDifficulty.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byDatabase: byDatabase.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// GET /api/v1/database-tutorials/:slug - Get single tutorial by slug
router.get('/:slug', async (req, res) => {
  try {
    const tutorial = await DatabaseTutorial.findOne({
      slug: req.params.slug
    });

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Database tutorial not found'
      });
    }

    // Increment view count
    tutorial.stats.views += 1;
    await tutorial.save();

    res.json({
      success: true,
      data: tutorial
    });
  } catch (error) {
    console.error('Get database tutorial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch database tutorial',
      error: error.message
    });
  }
});

module.exports = router;
