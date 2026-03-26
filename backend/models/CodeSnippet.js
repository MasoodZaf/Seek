const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
  userId: {
    type: String, // SQLite user ID (integer stored as string)
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeSnippet', codeSnippetSchema);
