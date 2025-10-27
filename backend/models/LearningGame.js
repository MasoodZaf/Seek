const mongoose = require('mongoose');

// Sub-schema for game challenges/questions
const ChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'code-completion', 'drag-drop', 'true-false', 'fill-blank', 'code-debug', 'pattern-match', 'sequence-order']
  },
  question: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  options: [{
    id: String,
    text: String,
    isCorrect: Boolean
  }],
  codeSnippet: {
    type: String,
    default: ''
  },
  expectedOutput: {
    type: String,
    default: ''
  },
  hints: [{
    type: String
  }],
  solution: {
    type: String,
    default: ''
  },
  correctAnswer: {
    type: String,
    default: ''
  },
  keyPoints: [{
    type: String
  }],
  explanation: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 10
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, { _id: false });

// Sub-schema for game rewards
const RewardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['badge', 'points', 'certificate', 'unlock', 'achievement'],
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
  icon: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    default: ''
  }
}, { _id: false });

// Main Learning Game Schema
const LearningGameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  gameType: {
    type: String,
    required: true,
    enum: [
      'quiz-rush', 'code-builder', 'syntax-matcher', 'debug-detective', 'pattern-puzzle',
      'speed-coder', 'logic-labyrinth', 'algorithm-arena', 'memory-match', 'typing-master',
      'code-golf', 'treasure-hunt', 'escape-room', 'tower-defense', 'role-playing'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Programming Fundamentals',
      'Web Development',
      'Data Structures',
      'Algorithms',
      'Database',
      'Security',
      'Machine Learning',
      'Mobile Development',
      'Game Development',
      'DevOps'
    ]
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'typescript', 'html', 'css', 'sql', 'general']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 180 // Increased to allow for complex expert-level games
  },
  maxScore: {
    type: Number,
    default: 1000
  },
  passingScore: {
    type: Number,
    default: 600
  },
  thumbnail: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  gameInstructions: {
    type: String,
    required: true
  },
  gameRules: [{
    type: String
  }],
  challenges: [ChallengeSchema],
  rewards: [RewardSchema],
  gameSettings: {
    livesCount: {
      type: Number,
      default: 3
    },
    timeLimit: {
      type: Number, // in minutes
      default: 15
    },
    hintsAllowed: {
      type: Number,
      default: 3
    },
    skipAllowed: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    allowRetry: {
      type: Boolean,
      default: true
    },
    multiplayer: {
      type: Boolean,
      default: false
    },
    leaderboard: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalPlays: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    difficulty_rating: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    name: {
      type: String,
      default: 'Seek Learning Team'
    },
    bio: {
      type: String,
      default: ''
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
LearningGameSchema.index({ slug: 1 });
LearningGameSchema.index({ gameType: 1, difficulty: 1 });
LearningGameSchema.index({ language: 1, category: 1 });
LearningGameSchema.index({ difficulty: 1 });
LearningGameSchema.index({ isActive: 1, isFeatured: 1 });
LearningGameSchema.index({ 'rating.average': -1 });
LearningGameSchema.index({ 'statistics.totalPlays': -1 });
LearningGameSchema.index({ createdAt: -1 });

// Virtual for game URL
LearningGameSchema.virtual('url').get(function () {
  return `/games/${this.slug}`;
});

// Virtual for challenge count
LearningGameSchema.virtual('challengeCount').get(function () {
  return this.challenges ? this.challenges.length : 0;
});

// Virtual for estimated XP reward
LearningGameSchema.virtual('estimatedXP').get(function () {
  const baseXP = {
    beginner: 50,
    intermediate: 100,
    advanced: 200,
    expert: 350
  };
  return baseXP[this.difficulty] || 50;
});

// Pre-save middleware to generate slug if not provided
LearningGameSchema.pre('save', function (next) {
  if (this.isNew && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
  next();
});

// Static methods
LearningGameSchema.statics.findByDifficulty = function (difficulty) {
  return this.find({ difficulty, isActive: true }).sort({ 'rating.average': -1 });
};

LearningGameSchema.statics.findByLanguage = function (language) {
  return this.find({ language, isActive: true }).sort({ createdAt: -1 });
};

LearningGameSchema.statics.findByGameType = function (gameType) {
  return this.find({ gameType, isActive: true }).sort({ 'statistics.totalPlays': -1 });
};

LearningGameSchema.statics.getFeatured = function () {
  return this.find({ isFeatured: true, isActive: true }).sort({ 'rating.average': -1 });
};

LearningGameSchema.statics.getPopular = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'statistics.totalPlays': -1, 'rating.average': -1 })
    .limit(limit);
};

LearningGameSchema.statics.search = function (query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ 'rating.average': -1 });
};

// Instance methods
LearningGameSchema.methods.incrementPlays = function () {
  this.statistics.totalPlays += 1;
  return this.save();
};

LearningGameSchema.methods.updateAverageScore = function (newScore) {
  const currentTotal = this.statistics.averageScore * this.statistics.totalPlays;
  this.statistics.averageScore = (currentTotal + newScore) / (this.statistics.totalPlays + 1);
  return this.save();
};

LearningGameSchema.methods.updateRating = function (newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

const LearningGame = mongoose.model('LearningGame', LearningGameSchema);

module.exports = LearningGame;
