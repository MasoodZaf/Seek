const express = require('express');
const router = express.Router();
const CodingChallenge = require('../models/CodingChallenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const UserSkillProfile = require('../models/UserSkillProfile');
const { executeCode } = require('../services/codeExecutionService');
const recommendationService = require('../services/challengeRecommendation');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // In a real app, check user role from JWT token or session
  // For now, check query parameter or header
  const isAdminUser = req.query.admin === 'true' || req.headers['x-admin-access'] === 'true';
  if (!isAdminUser) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required to view full challenge list'
    });
  }
  next();
};

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
      status, // accepted, attempted, todo
      admin // admin flag
    } = req.query;

    // Check if admin is requesting all challenges
    const isAdminRequest = admin === 'true' || req.headers['x-admin-access'] === 'true';
    const effectiveLimit = isAdminRequest ? 1000 : parseInt(limit); // No practical limit for admin

    const query = { isActive: true };

    // Apply filters
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (tags) {
      query.tags = { $in: tags.split(',') };
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
    let sortOption = {};
    if (sortBy === 'number') {
      sortOption = { number: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'acceptance') {
      sortOption = { acceptanceRate: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'difficulty') {
      sortOption = { difficulty: order === 'asc' ? 1 : -1 };
    } else {
      sortOption = { [sortBy]: order === 'asc' ? 1 : -1 };
    }

    const skip = isAdminRequest ? 0 : (page - 1) * effectiveLimit;

    const challenges = await CodingChallenge.find(query)
      .sort(sortOption)
      .limit(effectiveLimit)
      .skip(skip)
      .select('-testCases -solutions -hints'); // Exclude sensitive data

    const total = await CodingChallenge.countDocuments(query);

    // If user is logged in and status filter is provided, filter by user's submission status
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
        hasPrev: page > 1,
        isAdmin: isAdminRequest
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/:slug - Get single challenge by slug
router.get('/:slug', async (req, res) => {
  try {
    const challenge = await CodingChallenge.findOne({
      slug: req.params.slug,
      isActive: true
    }).select('-testCases.expectedOutput'); // Hide expected output for hidden test cases

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Get user's submission history if userId provided
    let submissionHistory = [];
    if (req.query.userId) {
      submissionHistory = await ChallengeSubmission.find({
        userId: req.query.userId,
        challengeId: challenge._id
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('-code'); // Don't send full code in history
    }

    res.json({
      success: true,
      data: {
        challenge,
        submissionHistory
      }
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge',
      error: error.message
    });
  }
});

// POST /api/v1/challenges/:slug/run - Run code against sample test cases
router.post('/:slug/run', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const challenge = await CodingChallenge.findOne({
      slug: req.params.slug
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Run only against visible test cases (examples)
    const visibleTestCases = challenge.testCases.filter(tc => !tc.isHidden);
    const results = [];

    for (const testCase of visibleTestCases) {
      try {
        const result = await executeCode({
          code,
          language,
          input: JSON.stringify(testCase.input)
        });

        const passed = JSON.stringify(result.output) === JSON.stringify(testCase.expectedOutput);

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.output,
          passed,
          runtime: result.executionTime
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          error: error.message,
          passed: false
        });
      }
    }

    const allPassed = results.every(r => r.passed);

    res.json({
      success: true,
      data: {
        results,
        allPassed,
        totalTests: results.length,
        passedTests: results.filter(r => r.passed).length
      }
    });
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run code',
      error: error.message
    });
  }
});

// POST /api/v1/challenges/:slug/submit - Submit solution
router.post('/:slug/submit', async (req, res) => {
  try {
    const { code, language, userId = 'guest' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const challenge = await CodingChallenge.findOne({
      slug: req.params.slug
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Run against all test cases
    const results = [];
    let status = 'Accepted';
    let failedTestCase = null;
    let totalRuntime = 0;

    for (const testCase of challenge.testCases) {
      try {
        const startTime = Date.now();
        const result = await executeCode({
          code,
          language,
          input: JSON.stringify(testCase.input),
          timeout: challenge.timeLimit
        });
        const runtime = Date.now() - startTime;
        totalRuntime += runtime;

        // Check if output matches
        const actualOutput = typeof result.output === 'string' ?
          result.output.trim() : result.output;
        const expectedOutput = typeof testCase.expectedOutput === 'string' ?
          testCase.expectedOutput.trim() : testCase.expectedOutput;

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
          runtime
        });

        if (runtime > challenge.timeLimit) {
          status = 'Time Limit Exceeded';
          break;
        }
      } catch (error) {
        status = error.message.includes('timeout') ? 'Time Limit Exceeded' : 'Runtime Error';
        failedTestCase = {
          input: testCase.input,
          error: error.message
        };
        break;
      }
    }

    const testCasesPassed = results.filter(r => r.passed).length;
    const avgRuntime = totalRuntime / results.length;

    // Save submission
    const submission = new ChallengeSubmission({
      userId,
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

    await submission.save();

    // Update challenge stats
    challenge.totalSubmissions += 1;
    if (status === 'Accepted') {
      challenge.totalAccepted += 1;
      challenge.acceptanceRate = (challenge.totalAccepted / challenge.totalSubmissions) * 100;
    }
    await challenge.save();

    // Update user skill profile if not guest
    if (userId && userId !== 'guest') {
      await recommendationService.updateSkillProfile(
        userId,
        challenge._id,
        status === 'Accepted'
      );
    }

    res.json({
      success: true,
      data: {
        status,
        runtime: Math.round(avgRuntime),
        testCasesPassed,
        totalTestCases: challenge.testCases.length,
        failedTestCase: status !== 'Accepted' ? failedTestCase : null,
        submissionId: submission._id
      }
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit solution',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/:slug/submissions - Get user submissions for a challenge
router.get('/:slug/submissions', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const challenge = await CodingChallenge.findOne({
      slug: req.params.slug
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    const submissions = await ChallengeSubmission.find({
      userId,
      challengeId: challenge._id
    })
    .sort({ timestamp: -1 })
    .limit(20);

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/stats/summary - Get user challenge statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const totalChallenges = await CodingChallenge.countDocuments({ isActive: true });

    const acceptedSubmissions = await ChallengeSubmission.aggregate([
      {
        $match: {
          userId,
          status: 'Accepted'
        }
      },
      {
        $group: {
          _id: '$challengeSlug'
        }
      }
    ]);

    const solvedByDifficulty = await ChallengeSubmission.aggregate([
      {
        $match: {
          userId,
          status: 'Accepted'
        }
      },
      {
        $lookup: {
          from: 'codingchallenges',
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge'
        }
      },
      {
        $unwind: '$challenge'
      },
      {
        $group: {
          _id: '$challenge.difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalChallenges,
      solvedChallenges: acceptedSubmissions.length,
      solvedPercentage: ((acceptedSubmissions.length / totalChallenges) * 100).toFixed(1),
      byDifficulty: {
        easy: solvedByDifficulty.find(s => s._id === 'easy')?.count || 0,
        medium: solvedByDifficulty.find(s => s._id === 'medium')?.count || 0,
        hard: solvedByDifficulty.find(s => s._id === 'hard')?.count || 0
      }
    };

    res.json({
      success: true,
      data: stats
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

// GET /api/v1/challenges/admin/all - Get ALL challenges (admin only)
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    const challenges = await CodingChallenge.find({ isActive: true })
      .sort({ number: 1 })
      .select('-solutions -testCases'); // Exclude solutions from list

    res.json({
      success: true,
      data: challenges,
      total: challenges.length,
      message: 'Full challenge list (admin access)'
    });
  } catch (error) {
    console.error('Get all challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/recommended - Get personalized recommendations
router.get('/recommended', async (req, res) => {
  try {
    const { userId, count = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const recommendations = await recommendationService.getRecommendations(userId, parseInt(count));

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      message: 'Personalized challenge recommendations'
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/daily - Get daily challenge
router.get('/daily', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      // Return a random easy challenge for non-logged-in users
      const challenge = await CodingChallenge.findOne({
        difficulty: 'easy',
        skillLevel: { $lte: 2 }
      });

      return res.json({
        success: true,
        data: challenge
      });
    }

    const dailyChallenge = await recommendationService.getDailyChallenge(userId);

    res.json({
      success: true,
      data: dailyChallenge,
      message: 'Daily challenge'
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily challenge',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/assessment/:questionNumber - Get assessment question
router.get('/assessment/:questionNumber', async (req, res) => {
  try {
    const { userId } = req.query;
    const questionNumber = parseInt(req.params.questionNumber);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const challenge = await recommendationService.getAssessmentChallenge(userId, questionNumber);

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Get assessment challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment challenge',
      error: error.message
    });
  }
});

// POST /api/v1/challenges/assessment/complete - Complete assessment
router.post('/assessment/complete', async (req, res) => {
  try {
    const { userId, results } = req.body;

    if (!userId || !results) {
      return res.status(400).json({
        success: false,
        message: 'userId and results are required'
      });
    }

    const profile = await recommendationService.completeAssessment(userId, results);

    res.json({
      success: true,
      data: profile,
      message: 'Assessment completed successfully'
    });
  } catch (error) {
    console.error('Complete assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete assessment',
      error: error.message
    });
  }
});

// GET /api/v1/challenges/profile/:userId - Get user skill profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let profile = await UserSkillProfile.findOne({ userId });

    if (!profile) {
      profile = await recommendationService.createInitialProfile(userId);
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;
