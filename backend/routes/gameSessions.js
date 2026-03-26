const express = require('express');
const router = express.Router();
const GameSession = require('../models/GameSession');
const LearningGame = require('../models/LearningGame');
const { protect } = require('../middleware/auth');
const logger = require('../config/logger');

// GET /api/v1/game-sessions/:sessionId - Get session details (requires auth)
router.get('/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findOne({ sessionId })
      .populate('gameId', 'title slug difficulty maxScore')
      .populate('userId', 'username'); // email excluded intentionally

    if (!session) {
      return res.status(404).json({ success: false, message: 'Game session not found' });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    logger.error('Get session error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch session details' });
  }
});

// PUT /api/v1/game-sessions/:sessionId/answer - Submit challenge answer (requires auth)
router.put('/:sessionId/answer', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { challengeId, userAnswer, timeSpent, hintsUsed } = req.body;

    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Game session not found' });
    }

    const game = await LearningGame.findById(session.gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const challenge = game.challenges.find((c) => c.challengeId === challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    let isCorrect = false;
    let pointsEarned = 0;

    if (challenge.type === 'multiple-choice') {
      const correctOption = challenge.options.find((opt) => opt.isCorrect);
      isCorrect = correctOption && correctOption.id === userAnswer;
    } else if (challenge.type === 'true-false') {
      isCorrect = challenge.expectedOutput === userAnswer;
    } else if (challenge.type === 'fill-blank' || challenge.type === 'code-completion') {
      isCorrect = challenge.expectedOutput.toLowerCase().trim() === String(userAnswer).toLowerCase().trim();
    }

    if (isCorrect) {
      pointsEarned = Math.round(challenge.points * session.gameState.bonusMultiplier);
    }

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

    session.progress.challengesCompleted += 1;
    if (isCorrect) session.progress.challengesCorrect += 1;

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
    logger.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit answer' });
  }
});

// PUT /api/v1/game-sessions/:sessionId/pause (requires auth)
router.put('/:sessionId/pause', protect, async (req, res) => {
  try {
    const session = await GameSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Game session not found' });

    await session.pauseSession();
    res.json({ success: true, data: session });
  } catch (error) {
    logger.error('Pause session error:', error);
    res.status(500).json({ success: false, message: 'Failed to pause session' });
  }
});

// PUT /api/v1/game-sessions/:sessionId/resume (requires auth)
router.put('/:sessionId/resume', protect, async (req, res) => {
  try {
    const session = await GameSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Game session not found' });

    await session.resumeSession();
    res.json({ success: true, data: session });
  } catch (error) {
    logger.error('Resume session error:', error);
    res.status(500).json({ success: false, message: 'Failed to resume session' });
  }
});

// POST /api/v1/game-sessions/:sessionId/complete (requires auth)
router.post('/:sessionId/complete', protect, async (req, res) => {
  try {
    const { userRating, feedback } = req.body;

    const session = await GameSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Game session not found' });

    if (userRating) session.finalStats.userRating = userRating;
    if (feedback) session.finalStats.feedback = feedback;

    await session.completeSession();

    const game = await LearningGame.findById(session.gameId);
    if (game && userRating) await game.updateRating(userRating);

    res.json({ success: true, data: { session, rewards: session.rewards, finalStats: session.finalStats } });
  } catch (error) {
    logger.error('Complete session error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete session' });
  }
});

// GET /api/v1/game-sessions/:sessionId/progress (requires auth)
router.get('/:sessionId/progress', protect, async (req, res) => {
  try {
    const session = await GameSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Game session not found' });

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
    logger.error('Get session progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch session progress' });
  }
});

// GET /api/v1/game-sessions/user/:userId/stats (requires auth)
router.get('/user/:userId/stats', protect, async (req, res) => {
  try {
    const stats = await GameSession.getUserStats(req.user.id);
    res.json({
      success: true,
      data: stats[0] || { totalGames: 0, completedGames: 0, averageScore: 0, totalXP: 0, totalTimeSpent: 0 }
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user statistics' });
  }
});

// GET /api/v1/game-sessions/analytics/:gameId (requires auth)
router.get('/analytics/:gameId', protect, async (req, res) => {
  try {
    const analytics = await GameSession.getGameAnalytics(req.params.gameId);
    res.json({
      success: true,
      data: analytics[0] || { totalSessions: 0, completedSessions: 0, averageScore: 0, averageTime: 0, averageAccuracy: 0 }
    });
  } catch (error) {
    logger.error('Get game analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch game analytics' });
  }
});

module.exports = router;
