const express = require('express');
const router = express.Router();
const CodingChallenge = require('../models/CodingChallenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const UserSkillProfile = require('../models/UserSkillProfile');
const User = require('../models/User');
const { executeCode } = require('../services/codeExecutionService');
const recommendationService = require('../services/challengeRecommendation');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../config/logger');

const XP_BY_DIFFICULTY = { easy: 50, medium: 100, hard: 200, expert: 350 };

// GET /api/v1/challenges - Get all challenges with filtering
router.get('/', async (req, res) => {
  try {
    const {
      difficulty,
      category,
      tags,
      search,
      limit = 50,
      page = 1,
      sortBy = 'number',
      order = 'asc',
      status
    } = req.query;

    const effectiveLimit = parseInt(limit);
    const query = { isActive: true };

    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    if (category && category !== 'all') query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = {};
    if (sortBy === 'number') sortOption = { number: order === 'asc' ? 1 : -1 };
    else if (sortBy === 'acceptance') sortOption = { acceptanceRate: order === 'asc' ? 1 : -1 };
    else if (sortBy === 'difficulty') sortOption = { difficulty: order === 'asc' ? 1 : -1 };
    else sortOption = { [sortBy]: order === 'asc' ? 1 : -1 };

    const skip = (page - 1) * effectiveLimit;

    let challenges = await CodingChallenge.find(query)
      .sort(sortOption)
      .limit(effectiveLimit)
      .skip(skip)
      .select('-testCases -solutions -hints');

    const total = await CodingChallenge.countDocuments(query);

    if (req.query.userId && status) {
      const userSubmissions = await ChallengeSubmission.find({
        userId: req.query.userId,
        status: 'Accepted'
      }).select('challengeSlug');

      const acceptedSlugs = new Set(userSubmissions.map(s => s.challengeSlug));

      if (status === 'accepted') {
        challenges = challenges.filter(c => acceptedSlugs.has(c.slug));
      } else if (status === 'todo') {
        challenges = challenges.filter(c => !acceptedSlugs.has(c.slug));
      }
    }

    res.json({
      success: true,
      data: challenges,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / effectiveLimit),
        totalItems: total,
        hasNext: page * effectiveLimit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    logger.error('Get challenges error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch challenges' });
  }
});

// GET /api/v1/challenges/admin/all - Get ALL challenges (admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const challenges = await CodingChallenge.find({ isActive: true })
      .sort({ number: 1 })
      .select('-solutions -testCases');

    res.json({
      success: true,
      data: challenges,
      total: challenges.length
    });
  } catch (error) {
    logger.error('Get all challenges error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch challenges' });
  }
});

// GET /api/v1/challenges/recommended - Get personalized recommendations
router.get('/recommended', async (req, res) => {
  try {
    const { userId, count = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const recommendations = await recommendationService.getRecommendations(userId, parseInt(count));

    res.json({ success: true, data: recommendations, count: recommendations.length });
  } catch (error) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

// GET /api/v1/challenges/daily - Get daily challenge
router.get('/daily', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      const challenge = await CodingChallenge.findOne({ difficulty: 'easy', skillLevel: { $lte: 2 } });
      return res.json({ success: true, data: challenge });
    }

    const dailyChallenge = await recommendationService.getDailyChallenge(userId);
    res.json({ success: true, data: dailyChallenge });
  } catch (error) {
    logger.error('Get daily challenge error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch daily challenge' });
  }
});

// GET /api/v1/challenges/stats/summary - Get user challenge statistics
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const totalChallenges = await CodingChallenge.countDocuments({ isActive: true });

    const acceptedSubmissions = await ChallengeSubmission.aggregate([
      { $match: { userId, status: 'Accepted' } },
      { $group: { _id: '$challengeSlug' } }
    ]);

    const solvedByDifficulty = await ChallengeSubmission.aggregate([
      { $match: { userId, status: 'Accepted' } },
      { $lookup: { from: 'codingchallenges', localField: 'challengeId', foreignField: '_id', as: 'challenge' } },
      { $unwind: '$challenge' },
      { $group: { _id: '$challenge.difficulty', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalChallenges,
        solvedChallenges: acceptedSubmissions.length,
        solvedPercentage: ((acceptedSubmissions.length / totalChallenges) * 100).toFixed(1),
        byDifficulty: {
          easy: solvedByDifficulty.find(s => s._id === 'easy')?.count || 0,
          medium: solvedByDifficulty.find(s => s._id === 'medium')?.count || 0,
          hard: solvedByDifficulty.find(s => s._id === 'hard')?.count || 0
        }
      }
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// GET /api/v1/challenges/assessment/:questionNumber
router.get('/assessment/:questionNumber', protect, async (req, res) => {
  try {
    const questionNumber = parseInt(req.params.questionNumber);
    const challenge = await recommendationService.getAssessmentChallenge(req.user.id, questionNumber);
    res.json({ success: true, data: challenge });
  } catch (error) {
    logger.error('Get assessment challenge error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assessment challenge' });
  }
});

// POST /api/v1/challenges/assessment/complete
router.post('/assessment/complete', protect, async (req, res) => {
  try {
    const { results } = req.body;

    if (!results) {
      return res.status(400).json({ success: false, message: 'results are required' });
    }

    const profile = await recommendationService.completeAssessment(req.user.id, results);
    res.json({ success: true, data: profile });
  } catch (error) {
    logger.error('Complete assessment error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete assessment' });
  }
});

// GET /api/v1/challenges/deck - Get weighted random deck of 25 unsolved challenges
router.get('/deck', protect, async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const userLevel = req.user.progress?.level || 1;
    const showCompleted = req.query.showCompleted === 'true';

    // Get slugs the user has already solved
    const acceptedSubs = await ChallengeSubmission.aggregate([
      { $match: { userId, status: 'Accepted' } },
      { $group: { _id: '$challengeSlug' } }
    ]);
    const solvedSlugs = new Set(acceptedSubs.map(s => s._id));

    if (showCompleted) {
      // Return only solved challenges
      const solved = await CodingChallenge.find({ slug: { $in: [...solvedSlugs] }, isActive: true })
        .select('-testCases -solutions').sort({ number: 1 });
      return res.json({ success: true, data: { challenges: solved, solvedCount: solvedSlugs.size, totalCount: 200 } });
    }

    // Weighted difficulty distribution based on user level
    // Level 1-3: 50% easy, 35% medium, 15% hard
    // Level 4-6: 20% easy, 50% medium, 30% hard
    // Level 7+:  5% easy, 35% medium, 60% hard
    let weights;
    if (userLevel <= 3) weights = { easy: 50, medium: 35, hard: 15 };
    else if (userLevel <= 6) weights = { easy: 20, medium: 50, hard: 30 };
    else weights = { easy: 5, medium: 35, hard: 60 };

    // Target counts out of 25
    const total = 25;
    const easyCount = Math.round(total * weights.easy / 100);
    const mediumCount = Math.round(total * weights.medium / 100);
    const hardCount = total - easyCount - mediumCount;

    const fetchRandom = async (difficulty, count) => {
      if (count <= 0) return [];
      return CodingChallenge.aggregate([
        { $match: { difficulty, isActive: true, slug: { $nin: [...solvedSlugs] } } },
        { $sample: { size: count } },
        { $project: { testCases: 0, solutions: 0 } }
      ]);
    };

    const [easy, medium, hard] = await Promise.all([
      fetchRandom('easy', easyCount),
      fetchRandom('medium', mediumCount),
      fetchRandom('hard', hardCount)
    ]);

    // Shuffle combined deck
    const deck = [...easy, ...medium, ...hard].sort(() => Math.random() - 0.5);

    res.json({
      success: true,
      data: {
        challenges: deck,
        solvedCount: solvedSlugs.size,
        totalCount: 200,
        weights
      }
    });
  } catch (err) {
    logger.error('Deck fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch deck' });
  }
});

// GET /api/v1/challenges/:slug - Get single challenge by slug
router.get('/:slug', async (req, res) => {
  try {
    const challenge = await CodingChallenge.findOne({
      slug: req.params.slug,
      isActive: true
    }).select('-testCases.expectedOutput');

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    let submissionHistory = [];
    if (req.query.userId) {
      submissionHistory = await ChallengeSubmission.find({
        userId: req.query.userId,
        challengeId: challenge._id
      })
        .sort({ timestamp: -1 })
        .limit(10)
        .select('-code');
    }

    res.json({ success: true, data: { challenge, submissionHistory } });
  } catch (error) {
    logger.error('Get challenge error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch challenge' });
  }
});

// POST /api/v1/challenges/:slug/run - Run code (requires auth)
router.post('/:slug/run', protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const challenge = await CodingChallenge.findOne({ slug: req.params.slug });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const visibleTestCases = challenge.testCases.filter(tc => !tc.isHidden);
    const results = [];

    for (const testCase of visibleTestCases) {
      try {
        const result = await executeCode(
          req.user.id,
          code,
          language,
          JSON.stringify(testCase.input)
        );

        const passed = JSON.stringify(result.output) === JSON.stringify(testCase.expectedOutput);
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.output,
          passed,
          runtime: result.executionTime
        });
      } catch (err) {
        results.push({ input: testCase.input, error: 'Execution error', passed: false });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        allPassed: results.every(r => r.passed),
        totalTests: results.length,
        passedTests: results.filter(r => r.passed).length
      }
    });
  } catch (error) {
    logger.error('Run code error:', error);
    res.status(500).json({ success: false, message: 'Failed to run code' });
  }
});

// POST /api/v1/challenges/:slug/submit - Submit solution (requires auth)
router.post('/:slug/submit', protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const challenge = await CodingChallenge.findOne({ slug: req.params.slug });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const results = [];
    let status = 'Accepted';
    let failedTestCase = null;
    let totalRuntime = 0;

    for (const testCase of challenge.testCases) {
      try {
        const startTime = Date.now();
        const result = await executeCode(
          req.user.id,
          code,
          language,
          JSON.stringify(testCase.input),
          null,
          null,
          null,
          { timeout: challenge.timeLimit }
        );
        const runtime = Date.now() - startTime;
        totalRuntime += runtime;

        const actualOutput = typeof result.output === 'string' ? result.output.trim() : result.output;
        const expectedOutput = typeof testCase.expectedOutput === 'string'
          ? testCase.expectedOutput.trim()
          : testCase.expectedOutput;

        const passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);

        if (!passed && status === 'Accepted') {
          status = 'Wrong Answer';
          failedTestCase = {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: result.output
          };
        }

        results.push({
          passed,
          runtime,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.output
        });

        if (runtime > challenge.timeLimit) {
          status = 'Time Limit Exceeded';
          break;
        }
      } catch (err) {
        status = err.message.includes('timeout') ? 'Time Limit Exceeded' : 'Runtime Error';
        failedTestCase = { input: testCase.input, error: 'Execution error' };
        results.push({ passed: false, runtime: 0, input: testCase.input, error: 'Execution error' });
        break;
      }
    }

    const testCasesPassed = results.filter(r => r.passed).length;
    const avgRuntime = results.length > 0 ? totalRuntime / results.length : 0;

    const submission = new ChallengeSubmission({
      userId: req.user.id,
      challengeId: challenge._id,
      challengeSlug: challenge.slug,
      code,
      language,
      status,
      runtime: Math.round(avgRuntime),
      testCasesPassed,
      totalTestCases: challenge.testCases.length,
      failedTestCase
    });

    // Save submission first — this is the critical write. User must always get their result.
    await submission.save();

    // Update challenge aggregate stats — non-critical, decouple from submission response
    try {
      challenge.totalSubmissions += 1;
      if (status === 'Accepted') {
        challenge.totalAccepted += 1;
        challenge.acceptanceRate = (challenge.totalAccepted / challenge.totalSubmissions) * 100;
      }
      await challenge.save();
    } catch (statsErr) {
      logger.error('Challenge stats update failed (submission already saved):', statsErr);
    }

    // Update recommendation model — non-critical
    try {
      await recommendationService.updateSkillProfile(req.user.id, challenge._id, status === 'Accepted');
    } catch (recErr) {
      logger.error('Recommendation profile update failed:', recErr);
    }

    // Award XP when accepted — non-critical, already has inner try-catch
    let xpEarned = 0;
    let newTotalPoints = 0;
    let newLevel = 1;
    if (status === 'Accepted') {
      xpEarned = XP_BY_DIFFICULTY[challenge.difficulty] || 50;
      try {
        const sqlUser = await User.findOne({ where: { id: req.user.id } });
        if (sqlUser) {
          const progress = sqlUser.progress || {};
          const updatedPoints = (progress.totalPoints || 0) + xpEarned;
          newLevel = Math.floor(updatedPoints / 500) + 1;
          await User.update(
            { progress: { ...progress, totalPoints: updatedPoints, level: newLevel } },
            { where: { id: req.user.id } }
          );
          newTotalPoints = updatedPoints;
        }
      } catch (xpErr) {
        logger.error('XP award error:', xpErr);
      }
    }

    res.json({
      success: true,
      data: {
        status,
        runtime: Math.round(avgRuntime),
        testCasesPassed,
        totalTestCases: challenge.testCases.length,
        testResults: results,
        failedTestCase: status !== 'Accepted' ? failedTestCase : null,
        submissionId: submission._id,
        xpEarned,
        newTotalPoints,
        newLevel
      }
    });
  } catch (error) {
    logger.error('Submit solution error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit solution' });
  }
});

// GET /api/v1/challenges/:slug/submissions - Get user submissions (requires auth)
router.get('/:slug/submissions', protect, async (req, res) => {
  try {
    const challenge = await CodingChallenge.findOne({ slug: req.params.slug });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const submissions = await ChallengeSubmission.find({
      userId: req.user.id,
      challengeId: challenge._id
    })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({ success: true, data: submissions });
  } catch (error) {
    logger.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

// GET /api/v1/challenges/profile/:userId - Get user skill profile
router.get('/profile/:userId', protect, async (req, res) => {
  try {
    let profile = await UserSkillProfile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await recommendationService.createInitialProfile(req.user.id);
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

module.exports = router;
