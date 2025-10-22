const mongoose = require('mongoose');

const challengeSubmissionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge',
    required: true
  },
  challengeSlug: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compile Error'],
    required: true
  },
  runtime: {
    type: Number // in milliseconds
  },
  memory: {
    type: Number // in KB
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  failedTestCase: {
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    actualOutput: mongoose.Schema.Types.Mixed,
    error: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  executionDetails: {
    output: String,
    error: String,
    warnings: [String]
  }
}, {
  timestamps: true
});

// Indexes
challengeSubmissionSchema.index({ userId: 1, challengeId: 1 });
challengeSubmissionSchema.index({ userId: 1, status: 1 });
challengeSubmissionSchema.index({ challengeSlug: 1 });
challengeSubmissionSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ChallengeSubmission', challengeSubmissionSchema);
