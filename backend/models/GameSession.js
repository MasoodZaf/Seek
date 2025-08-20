const mongoose = require('mongoose');

// Sub-schema for individual challenge attempts
const ChallengeAttemptSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, array, object depending on challenge type
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  submittedCode: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Sub-schema for achievements earned during game session
const SessionAchievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Main Game Session Schema
const GameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningGame',
    required: true
  },
  gameSlug: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'paused', 'completed', 'abandoned', 'failed'],
    default: 'started'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  pausedAt: {
    type: Date
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    current: {
      type: Number,
      default: 0
    },
    maximum: {
      type: Number,
      default: 1000
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  progress: {
    currentChallenge: {
      type: Number,
      default: 0
    },
    totalChallenges: {
      type: Number,
      required: true
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    challengesCorrect: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  gameState: {
    livesRemaining: {
      type: Number,
      default: 3
    },
    hintsRemaining: {
      type: Number,
      default: 3
    },
    powerUpsUsed: [{
      type: String,
      usedAt: Date
    }],
    streakCount: {
      type: Number,
      default: 0
    },
    maxStreak: {
      type: Number,
      default: 0
    },
    bonusMultiplier: {
      type: Number,
      default: 1.0
    }
  },
  challengeAttempts: [ChallengeAttemptSchema],
  achievements: [SessionAchievementSchema],
  finalStats: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    },
    averageTimePerChallenge: {
      type: Number,
      default: 0
    },
    fastestSolve: {
      type: Number,
      default: 0
    },
    slowestSolve: {
      type: Number,
      default: 0
    },
    totalHintsUsed: {
      type: Number,
      default: 0
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 5
    },
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  rewards: {
    xpEarned: {
      type: Number,
      default: 0
    },
    badgesEarned: [{
      badgeId: String,
      name: String,
      description: String,
      earnedAt: Date
    }],
    certificateEarned: {
      issued: {
        type: Boolean,
        default: false
      },
      certificateId: String,
      issuedAt: Date
    },
    leaderboardPosition: {
      type: Number,
      default: 0
    }
  },
  multiplayer: {
    isMultiplayer: {
      type: Boolean,
      default: false
    },
    roomId: String,
    opponents: [{
      userId: mongoose.Schema.Types.ObjectId,
      username: String,
      score: Number,
      position: Number
    }],
    finalRanking: {
      type: Number,
      default: 1
    }
  },
  deviceInfo: {
    platform: String,
    browser: String,
    screenResolution: String,
    isMobile: Boolean
  },
  sessionMetrics: {
    pauseCount: {
      type: Number,
      default: 0
    },
    resumeCount: {
      type: Number,
      default: 0
    },
    helpRequests: {
      type: Number,
      default: 0
    },
    errorCount: {
      type: Number,
      default: 0
    },
    connectionIssues: {
      type: Number,
      default: 0
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
GameSessionSchema.index({ userId: 1, gameId: 1 });
GameSessionSchema.index({ sessionId: 1 });
GameSessionSchema.index({ status: 1 });
GameSessionSchema.index({ startedAt: -1 });
GameSessionSchema.index({ 'score.current': -1 });
GameSessionSchema.index({ gameSlug: 1, 'score.current': -1 });

// Virtuals
GameSessionSchema.virtual('duration').get(function () {
  if (this.completedAt && this.startedAt) {
    return Math.floor((this.completedAt - this.startedAt) / 1000); // in seconds
  }
  return this.totalTimeSpent;
});

GameSessionSchema.virtual('isCompleted').get(function () {
  return this.status === 'completed';
});

GameSessionSchema.virtual('accuracyPercentage').get(function () {
  const total = this.challengeAttempts.length;
  if (total === 0) return 0;
  const correct = this.challengeAttempts.filter((attempt) => attempt.isCorrect).length;
  return Math.round((correct / total) * 100);
});

// Pre-save middleware
GameSessionSchema.pre('save', function (next) {
  // Update progress percentage
  if (this.progress.totalChallenges > 0) {
    this.progress.percentage = Math.round(
      (this.progress.challengesCompleted / this.progress.totalChallenges) * 100
    );
  }

  // Update score percentage
  if (this.score.maximum > 0) {
    this.score.percentage = Math.round(
      (this.score.current / this.score.maximum) * 100
    );
  }

  // Update last activity
  this.lastActivityAt = new Date();

  // Calculate final stats if completed
  if (this.status === 'completed' && this.challengeAttempts.length > 0) {
    this.finalStats.totalAttempts = this.challengeAttempts.length;
    this.finalStats.correctAnswers = this.challengeAttempts.filter((a) => a.isCorrect).length;
    this.finalStats.accuracy = (this.finalStats.correctAnswers / this.finalStats.totalAttempts) * 100;

    const times = this.challengeAttempts.map((a) => a.timeSpent).filter((t) => t > 0);
    if (times.length > 0) {
      this.finalStats.averageTimePerChallenge = times.reduce((a, b) => a + b, 0) / times.length;
      this.finalStats.fastestSolve = Math.min(...times);
      this.finalStats.slowestSolve = Math.max(...times);
    }

    this.finalStats.totalHintsUsed = this.challengeAttempts.reduce((total, a) => total + a.hintsUsed, 0);
  }

  next();
});

// Static methods
GameSessionSchema.statics.getLeaderboard = function (gameId, limit = 10) {
  return this.find({
    gameId,
    status: 'completed'
  })
    .sort({ 'score.current': -1, totalTimeSpent: 1 })
    .limit(limit)
    .populate('userId', 'username email');
};

GameSessionSchema.statics.getUserStats = function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        completedGames: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        averageScore: { $avg: '$score.current' },
        totalXP: { $sum: '$rewards.xpEarned' },
        totalTimeSpent: { $sum: '$totalTimeSpent' }
      }
    }
  ]);
};

GameSessionSchema.statics.getGameAnalytics = function (gameId) {
  return this.aggregate([
    { $match: { gameId: mongoose.Types.ObjectId(gameId) } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        completedSessions: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        averageScore: { $avg: '$score.current' },
        averageTime: { $avg: '$totalTimeSpent' },
        averageAccuracy: { $avg: '$finalStats.accuracy' }
      }
    }
  ]);
};

// Instance methods
GameSessionSchema.methods.addChallengeAttempt = function (challengeData) {
  this.challengeAttempts.push(challengeData);

  // Update progress
  if (challengeData.isCorrect) {
    this.progress.challengesCorrect += 1;
    this.gameState.streakCount += 1;
    this.gameState.maxStreak = Math.max(this.gameState.maxStreak, this.gameState.streakCount);
  } else {
    this.gameState.streakCount = 0;
  }

  // Update score
  this.score.current += challengeData.pointsEarned;

  return this.save();
};

GameSessionSchema.methods.pauseSession = function () {
  this.status = 'paused';
  this.pausedAt = new Date();
  this.sessionMetrics.pauseCount += 1;
  return this.save();
};

GameSessionSchema.methods.resumeSession = function () {
  this.status = 'in_progress';
  this.pausedAt = null;
  this.sessionMetrics.resumeCount += 1;
  return this.save();
};

GameSessionSchema.methods.completeSession = function () {
  this.status = 'completed';
  this.completedAt = new Date();

  // Calculate XP based on performance
  const baseXP = {
    beginner: 50,
    intermediate: 100,
    advanced: 200,
    expert: 350
  };

  const difficultyXP = baseXP.beginner; // Default, should be set based on game difficulty
  const scoreMultiplier = this.score.percentage / 100;
  const timeBonus = this.totalTimeSpent < 300 ? 1.2 : 1.0; // Bonus for completing under 5 minutes

  this.rewards.xpEarned = Math.round(difficultyXP * scoreMultiplier * timeBonus);

  return this.save();
};

const GameSession = mongoose.model('GameSession', GameSessionSchema);

module.exports = GameSession;
