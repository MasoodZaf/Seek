const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expectedOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  explanation: String
});

const constraintSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
});

const hintSchema = new mongoose.Schema({
  order: Number,
  text: String,
  cost: {
    type: Number,
    default: 0
  }
});

const solutionSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  explanation: String,
  timeComplexity: String,
  spaceComplexity: String
});

const codingChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'Array',
      'String',
      'Hash Table',
      'Dynamic Programming',
      'Math',
      'Sorting',
      'Greedy',
      'Depth-First Search',
      'Binary Search',
      'Database',
      'Breadth-First Search',
      'Tree',
      'Matrix',
      'Two Pointers',
      'Bit Manipulation',
      'Stack',
      'Design',
      'Heap',
      'Graph',
      'Simulation',
      'Backtracking',
      'Sliding Window',
      'Linked List',
      'Union Find',
      'Recursion',
      'Binary Tree',
      'Divide and Conquer'
    ],
    required: true
  },
  tags: [{
    type: String
  }],
  companies: [{
    type: String
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  acceptanceRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  totalAccepted: {
    type: Number,
    default: 0
  },
  constraints: [constraintSchema],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  hints: [hintSchema],
  starterCode: [{
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    functionName: String
  }],
  solutions: [solutionSchema],
  relatedTopics: [{
    type: String
  }],
  similarQuestions: [{
    title: String,
    slug: String,
    difficulty: String
  }],
  timeLimit: {
    type: Number,
    default: 3000 // milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 256 // MB
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
codingChallengeSchema.index({ difficulty: 1, category: 1 });
codingChallengeSchema.index({ slug: 1 });
codingChallengeSchema.index({ number: 1 });
codingChallengeSchema.index({ tags: 1 });
codingChallengeSchema.index({ acceptanceRate: -1 });

// Virtual for difficulty color
codingChallengeSchema.virtual('difficultyColor').get(function() {
  const colors = {
    easy: 'green',
    medium: 'orange',
    hard: 'red'
  };
  return colors[this.difficulty];
});

module.exports = mongoose.model('CodingChallenge', codingChallengeSchema);
