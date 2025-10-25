const mongoose = require('mongoose');

// Sub-schema for code examples within tutorial steps
const CodeExampleSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'typescript', 'html', 'css', 'sql']
  },
  code: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  isExecutable: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Sub-schema for tutorial steps with 3-phase learning
const TutorialStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  codeExamples: [CodeExampleSchema],
  hints: [{
    type: String
  }],
  expectedOutput: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: false
  },

  // PHASE 1: LEARN - Understanding the concept
  learnPhase: {
    conceptExplanation: { type: String, default: '' },
    keyPoints: [{ type: String }],
    visualAid: {
      type: { type: String, enum: ['diagram', 'animation', 'flowchart', 'none'], default: 'none' },
      description: String,
      url: String
    },
    realWorldExample: { type: String, default: '' },
    whyItMatters: { type: String, default: '' },
    commonMistakes: [{ type: String }]
  },

  // PHASE 2: PRACTICE - Guided coding
  practicePhase: {
    instructions: [{
      step: Number,
      instruction: String,
      hint: String
    }],
    starterCode: { type: String, default: '' },
    solution: { type: String, default: '' },
    hints: [{
      level: Number,
      hint: String,
      unlocked: { type: Boolean, default: false }
    }],
    tests: [{
      name: String,
      description: String,
      type: { type: String, enum: ['syntax', 'output', 'quality'] },
      expected: String
    }],
    helpfulResources: [{ title: String, url: String }]
  },

  // PHASE 3: CHALLENGE - Apply knowledge
  challengePhase: {
    problemStatement: { type: String, default: '' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    requirements: [{ type: String }],
    testCases: [{
      input: String,
      expected: String,
      points: Number
    }],
    bonusObjectives: [{ type: String }]
  },

  // Timing estimates for each phase
  estimatedTime: {
    learn: { type: Number, default: 5 }, // minutes
    practice: { type: Number, default: 10 },
    challenge: { type: Number, default: 15 }
  },

  // Progress tracking
  completionCriteria: {
    learnCompleted: { type: Boolean, default: false },
    practiceCompleted: { type: Boolean, default: false },
    challengeCompleted: { type: Boolean, default: false }
  }
}, { _id: false });

// Sub-schema for quiz questions
const QuizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'true-false', 'code-completion', 'short-answer']
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String
  },
  explanation: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 1
  }
}, { _id: false });

// Main Tutorial Schema
const TutorialSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Programming Fundamentals',
      'Data Structures',
      'Algorithms',
      'Database',
      'Mobile Development',
      'Game Development',
      'Machine Learning',
      'DevOps',
      'Security'
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
    enum: ['beginner', 'intermediate', 'advanced']
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true,
    min: 5,
    max: 480 // 8 hours max
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
  steps: [TutorialStepSchema],
  quiz: [QuizQuestionSchema],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['documentation', 'video', 'article', 'tool', 'reference']
    }
  }],
  author: {
    name: {
      type: String,
      required: true,
      default: 'Seek Learning Platform'
    },
    email: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    }
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
TutorialSchema.index({ slug: 1 });
TutorialSchema.index({ category: 1, difficulty: 1 });
TutorialSchema.index({ language: 1 });
TutorialSchema.index({ tags: 1 });
TutorialSchema.index({ isPublished: 1 });
TutorialSchema.index({ 'rating.average': -1 });
TutorialSchema.index({ 'stats.views': -1 });
TutorialSchema.index({ createdAt: -1 });

// Virtual for tutorial URL
TutorialSchema.virtual('url').get(function () {
  return `/tutorials/${this.slug}`;
});

// Virtual for step count
TutorialSchema.virtual('stepCount').get(function () {
  return this.steps ? this.steps.length : 0;
});

// Virtual for completion rate (if we track user progress)
TutorialSchema.virtual('completionRate').get(function () {
  if (this.stats.views === 0) return 0;
  return Math.round((this.stats.completions / this.stats.views) * 100);
});

// Pre-save middleware to generate slug if not provided
TutorialSchema.pre('save', function (next) {
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
TutorialSchema.statics.findByCategory = function (category) {
  return this.find({ category, isPublished: true }).sort({ 'rating.average': -1 });
};

TutorialSchema.statics.findByLanguage = function (language) {
  return this.find({ language, isPublished: true }).sort({ createdAt: -1 });
};

TutorialSchema.statics.findByDifficulty = function (difficulty) {
  return this.find({ difficulty, isPublished: true }).sort({ 'stats.views': -1 });
};

TutorialSchema.statics.getFeatured = function () {
  return this.find({ isFeatured: true, isPublished: true }).sort({ 'rating.average': -1 });
};

TutorialSchema.statics.search = function (query) {
  return this.find({
    $and: [
      { isPublished: true },
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
TutorialSchema.methods.incrementViews = function () {
  this.stats.views += 1;
  return this.save();
};

TutorialSchema.methods.incrementCompletions = function () {
  this.stats.completions += 1;
  return this.save();
};

TutorialSchema.methods.updateRating = function (newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

const DatabaseTutorial = mongoose.model('DatabaseTutorial', TutorialSchema, 'database_tutorials');

module.exports = DatabaseTutorial;
