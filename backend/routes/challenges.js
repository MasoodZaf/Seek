const express = require('express');
const router = express.Router();
const CodingChallenge = require('../models/CodingChallenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const { executeCode } = require('../services/codeExecutionService');

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
      status // accepted, attempted, todo
    } = req.query;

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

    const skip = (page - 1) * limit;

    const challenges = await CodingChallenge.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
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
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
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

module.exports = router;
