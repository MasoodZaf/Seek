const mongoose = require('mongoose');

const topicMasterySchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastPracticed: Date
});

const userSkillProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  overallLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
    comment: '1-3: Beginner, 4-6: Intermediate, 7-10: Advanced'
  },
  topicMastery: [topicMasterySchema],

  // Performance metrics
  totalChallengesSolved: {
    type: Number,
    default: 0
  },
  easySolved: {
    type: Number,
    default: 0
  },
  mediumSolved: {
    type: Number,
    default: 0
  },
  hardSolved: {
    type: Number,
    default: 0
  },
  averageAttempts: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number,
    default: 0,
    comment: 'in minutes'
  },

  // Learning patterns
  preferredDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  learningStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },

  // Strengths and weaknesses
  strongTopics: [{
    type: String
  }],
  weakTopics: [{
    type: String
  }],

  // Assessment data
  initialAssessmentCompleted: {
    type: Boolean,
    default: false
  },
  assessmentScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  assessmentDate: Date,

  // Recommendation settings
  challengePreferences: {
    categories: [{
      type: String
    }],
    avoidCategories: [{
      type: String
    }],
    targetCompanies: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

// Methods
userSkillProfileSchema.methods.updateTopicMastery = function(topic, success) {
  const topicIndex = this.topicMastery.findIndex(t => t.topic === topic);

  if (topicIndex >= 0) {
    const topicData = this.topicMastery[topicIndex];
    topicData.problemsSolved += 1;
    topicData.successRate = ((topicData.successRate * (topicData.problemsSolved - 1)) + (success ? 100 : 0)) / topicData.problemsSolved;

    // Increase level based on performance
    if (success && topicData.successRate > 70) {
      topicData.level = Math.min(10, topicData.level + 0.5);
    }
    topicData.lastPracticed = new Date();
  } else {
    this.topicMastery.push({
      topic,
      level: success ? 1 : 0.5,
      problemsSolved: 1,
      successRate: success ? 100 : 0,
      lastPracticed: new Date()
    });
  }
};

userSkillProfileSchema.methods.calculateOverallLevel = function() {
  if (this.topicMastery.length === 0) return 1;

  const avgLevel = this.topicMastery.reduce((sum, t) => sum + t.level, 0) / this.topicMastery.length;
  const solvedFactor = Math.min(2, this.totalChallengesSolved / 50); // Max +2 levels from volume

  this.overallLevel = Math.min(10, Math.max(1, avgLevel + solvedFactor));
  return this.overallLevel;
};

userSkillProfileSchema.methods.identifyStrengthsAndWeaknesses = function() {
  const sortedTopics = this.topicMastery.sort((a, b) => b.level - a.level);

  this.strongTopics = sortedTopics.slice(0, 3).map(t => t.topic);
  this.weakTopics = sortedTopics.slice(-3).filter(t => t.level < 5).map(t => t.topic);
};

module.exports = mongoose.model('UserSkillProfile', userSkillProfileSchema);
