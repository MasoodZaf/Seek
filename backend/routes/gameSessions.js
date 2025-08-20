const express = require('express');

const router = express.Router();
const GameSession = require('../models/GameSession');
const LearningGame = require('../models/LearningGame');

// GET /api/v1/game-sessions/:sessionId - Get session details
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findOne({ sessionId })
      .populate('gameId', 'title slug difficulty maxScore')
      .populate('userId', 'username email');

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session details'
    });
  }
});

// PUT /api/v1/game-sessions/:sessionId/answer - Submit challenge answer
router.put('/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      challengeId, userAnswer, timeSpent, hintsUsed
    } = req.body;

    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }

    // Get the game to validate the answer
    const game = await LearningGame.findById(session.gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    // Find the challenge
    const challenge = game.challenges.find((c) => c.challengeId === challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Validate answer (this is a simplified validation)
    let isCorrect = false;
    let pointsEarned = 0;

    if (challenge.type === 'multiple-choice') {
      const correctOption = challenge.options.find((opt) => opt.isCorrect);
      isCorrect = correctOption && correctOption.id === userAnswer;
    } else if (challenge.type === 'true-false') {
      isCorrect = challenge.expectedOutput === userAnswer;
    } else if (challenge.type === 'fill-blank' || challenge.type === 'code-completion') {
      // Simple string comparison (in production, use more sophisticated checking)
      isCorrect = challenge.expectedOutput.toLowerCase().trim()
                 === String(userAnswer).toLowerCase().trim();
    }

    if (isCorrect) {
      pointsEarned = challenge.points;
      // Apply bonus multiplier if streak exists
      pointsEarned = Math.round(pointsEarned * session.gameState.bonusMultiplier);
    }

    // Create challenge attempt
    const challengeAttempt = {
      challengeId,
      userAnswer,
      isCorrect,
      pointsEarned,
      timeSpent: timeSpent || 0,
      hintsUsed: hintsUsed || 0,
      attemptNumber: session.challengeAttempts.filter((a) => a.challengeId === challengeId).length + 1
    };

    await session.addChallengeAttempt(challengeAttempt);

    // Update progress
    session.progress.challengesCompleted += 1;
    if (isCorrect) {
      session.progress.challengesCorrect += 1;
    }

    // Check if game is completed
    if (session.progress.challengesCompleted >= session.progress.totalChallenges) {
      await session.completeSession();
    }

    res.json({
      success: true,
      data: {
        isCorrect,
        pointsEarned,
        session: {
          score: session.score,
          progress: session.progress,
          gameState: session.gameState,
          status: session.status
        },
        feedback: isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!',
        explanation: challenge.explanation || ''
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit answer'
    });
  }
});

// PUT /api/v1/game-sessions/:sessionId/pause - Pause game session
router.put('/:sessionId/pause', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }

    await session.pauseSession();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Pause session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to pause session'
    });
  }
});

// PUT /api/v1/game-sessions/:sessionId/resume - Resume game session
router.put('/:sessionId/resume', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }

    await session.resumeSession();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Resume session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resume session'
    });
  }
});

// POST /api/v1/game-sessions/:sessionId/complete - Complete game session
router.post('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userRating, feedback } = req.body;

    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }

    if (userRating) {
      session.finalStats.userRating = userRating;
    }
    if (feedback) {
      session.finalStats.feedback = feedback;
    }

    await session.completeSession();

    // Update game statistics
    const game = await LearningGame.findById(session.gameId);
    if (game && userRating) {
      await game.updateRating(userRating);
    }

    res.json({
      success: true,
      data: {
        session,
        rewards: session.rewards,
        finalStats: session.finalStats
      }
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete session'
    });
  }
});

// GET /api/v1/game-sessions/:sessionId/progress - Get session progress
router.get('/:sessionId/progress', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }

    res.json({
      success: true,
      data: {
        progress: session.progress,
        score: session.score,
        gameState: session.gameState,
        status: session.status,
        challengeAttempts: session.challengeAttempts,
        totalTimeSpent: session.totalTimeSpent
      }
    });
  } catch (error) {
    console.error('Get session progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session progress'
    });
  }
});

// GET /api/v1/game-sessions/user/:userId/stats - Get user game statistics
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await GameSession.getUserStats(userId);

    res.json({
      success: true,
      data: stats[0] || {
        totalGames: 0,
        completedGames: 0,
        averageScore: 0,
        totalXP: 0,
        totalTimeSpent: 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics'
    });
  }
});

// GET /api/v1/game-sessions/analytics/:gameId - Get game analytics
router.get('/analytics/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;

    const analytics = await GameSession.getGameAnalytics(gameId);

    res.json({
      success: true,
      data: analytics[0] || {
        totalSessions: 0,
        completedSessions: 0,
        averageScore: 0,
        averageTime: 0,
        averageAccuracy: 0
      }
    });
  } catch (error) {
    console.error('Get game analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game analytics'
    });
  }
});

module.exports = router;
