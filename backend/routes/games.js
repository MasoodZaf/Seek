const express = require('express');

const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const LearningGame = require('../models/LearningGame');
const GameSession = require('../models/GameSession');

// GET /api/v1/games - Get all games with filtering
router.get('/', async (req, res) => {
  try {
    const {
      difficulty,
      language,
      category,
      gameType,
      search,
      limit = 50,
      page = 1,
      featured,
      popular
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (language && language !== 'all') {
      query.language = language;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (gameType && gameType !== 'all') {
      query.gameType = gameType;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (popular === 'true') {
      sortOption = { 'statistics.totalPlays': -1, 'rating.average': -1 };
    } else if (featured === 'true') {
      sortOption = { 'rating.average': -1 };
    }

    const skip = (page - 1) * limit;

    const games = await LearningGame.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-challenges.expectedOutput -challenges.solution -challenges.correctAnswer -challenges.hints -challenges.keyPoints'); // Exclude sensitive data from list view

    const total = await LearningGame.countDocuments(query);

    res.json({
      success: true,
      data: games,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games'
    });
  }
});

// GET /api/v1/games/featured - Get featured games
router.get('/featured', async (req, res) => {
  try {
    const games = await LearningGame.getFeatured();
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Get featured games error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured games'
    });
  }
});

// GET /api/v1/games/popular - Get popular games
router.get('/popular', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const games = await LearningGame.getPopular(parseInt(limit));
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Get popular games error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular games'
    });
  }
});

// GET /api/v1/games/difficulty/:level - Get games by difficulty
router.get('/difficulty/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const games = await LearningGame.findByDifficulty(level);
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Get games by difficulty error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games by difficulty'
    });
  }
});

// GET /api/v1/games/language/:lang - Get games by language
router.get('/language/:lang', async (req, res) => {
  try {
    const { lang } = req.params;
    const games = await LearningGame.findByLanguage(lang);
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Get games by language error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games by language'
    });
  }
});

// GET /api/v1/games/category/:cat - Get games by category
router.get('/category/:cat', async (req, res) => {
  try {
    const { cat } = req.params;
    const games = await LearningGame.find({
      category: cat,
      isActive: true
    }).sort({ 'rating.average': -1 });

    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Get games by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games by category'
    });
  }
});

// GET /api/v1/games/:slug - Get specific game details
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await LearningGame.findOne({ slug, isActive: true });

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    // Increment play count
    await game.incrementPlays();

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Get game details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game details'
    });
  }
});

// POST /api/v1/games/:slug/start - Start a new game session
router.post('/:slug/start', async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id || req.body.userId; // Support both authenticated and guest users

    const game = await LearningGame.findOne({ slug, isActive: true });
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    const sessionId = uuidv4();
    const gameSession = new GameSession({
      sessionId,
      userId,
      gameId: game._id,
      gameSlug: slug,
      progress: {
        totalChallenges: game.challenges.length
      },
      score: {
        maximum: game.maxScore
      },
      gameSettings: game.gameSettings
    });

    await gameSession.save();

    res.json({
      success: true,
      data: {
        sessionId,
        game: {
          id: game._id,
          slug: game.slug,
          title: game.title,
          description: game.description,
          difficulty: game.difficulty,
          estimatedTime: game.estimatedTime,
          maxScore: game.maxScore,
          gameInstructions: game.gameInstructions,
          gameRules: game.gameRules,
          challenges: game.challenges.map((challenge) => ({
            challengeId: challenge.challengeId,
            type: challenge.type,
            question: challenge.question,
            description: challenge.description,
            options: challenge.options,
            codeSnippet: challenge.codeSnippet,
            points: challenge.points,
            timeLimit: challenge.timeLimit,
            difficulty: challenge.difficulty,
            hints: challenge.hints || [],
            solution: challenge.solution || '',
            correctAnswer: challenge.correctAnswer || '',
            keyPoints: challenge.keyPoints || [],
            explanation: challenge.explanation || ''
          }))
        },
        session: gameSession
      }
    });
  } catch (error) {
    console.error('Start game session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start game session'
    });
  }
});

// GET /api/v1/games/:slug/leaderboard - Get game leaderboard
router.get('/:slug/leaderboard', async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = req.query.limit || 10;

    const game = await LearningGame.findOne({ slug });
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    const leaderboard = await GameSession.getLeaderboard(game._id, parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// GET /api/v1/games/stats/summary - Get games statistics summary
router.get('/stats/summary', async (req, res) => {
  try {
    const totalGames = await LearningGame.countDocuments({ isActive: true });
    const gamesByDifficulty = await LearningGame.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    const gamesByCategory = await LearningGame.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const gamesByLanguage = await LearningGame.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalGames,
        byDifficulty: gamesByDifficulty,
        byCategory: gamesByCategory,
        byLanguage: gamesByLanguage
      }
    });
  } catch (error) {
    console.error('Get games stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games statistics'
    });
  }
});

module.exports = router;
