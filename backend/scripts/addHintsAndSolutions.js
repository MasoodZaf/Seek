require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const LearningGame = require('../models/LearningGame');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Function to generate hints based on challenge type and question
const generateHints = (challenge) => {
  const hints = [];

  if (challenge.type === 'multiple-choice') {
    hints.push('Read the question carefully and eliminate obviously wrong answers.');
    hints.push('Think about what you know about this topic from previous lessons.');

    if (challenge.question.toLowerCase().includes('keyword')) {
      hints.push('Remember that keywords are special reserved words in programming languages.');
    } else if (challenge.question.toLowerCase().includes('variable')) {
      hints.push('Variables are used to store data that can be used and changed later.');
    } else if (challenge.question.toLowerCase().includes('function')) {
      hints.push('Functions are reusable blocks of code that perform specific tasks.');
    } else if (challenge.question.toLowerCase().includes('loop')) {
      hints.push('Loops allow you to execute code multiple times.');
    }
  } else if (challenge.type === 'code-completion' || challenge.type === 'code-debug') {
    hints.push('Read the code line by line to understand what it does.');
    hints.push('Check for syntax errors like missing semicolons or brackets.');
    hints.push('Look at the expected output to understand what the code should do.');
  } else if (challenge.type === 'true-false') {
    hints.push('Think about what you know about this concept.');
    hints.push('Look for absolute words like "always" or "never" - they are often false.');
  } else if (challenge.type === 'fill-blank') {
    hints.push('What keyword or syntax would make this code valid?');
    hints.push('Consider the context and what you are trying to accomplish.');
  }

  return hints;
};

// Function to generate solution based on challenge
const generateSolution = (challenge) => {
  if (challenge.type === 'multiple-choice' || challenge.type === 'true-false') {
    const correctOption = challenge.options?.find(opt => opt.isCorrect);
    return correctOption ? correctOption.text : '';
  } else if (challenge.type === 'code-completion' && challenge.codeSnippet) {
    // For code completion, use expected output or provide a basic solution
    return challenge.expectedOutput || challenge.codeSnippet;
  } else if (challenge.type === 'fill-blank') {
    return challenge.expectedOutput || '';
  }
  return '';
};

// Function to generate key points based on challenge
const generateKeyPoints = (challenge) => {
  const keyPoints = [];

  if (challenge.type === 'multiple-choice') {
    if (challenge.question.toLowerCase().includes('variable')) {
      keyPoints.push('Variables are containers for storing data values');
      keyPoints.push('Use let or const to declare variables in modern JavaScript');
      keyPoints.push('Variable names should be descriptive and follow camelCase convention');
    } else if (challenge.question.toLowerCase().includes('function')) {
      keyPoints.push('Functions are reusable blocks of code');
      keyPoints.push('Functions can accept parameters and return values');
      keyPoints.push('Use function keyword or arrow syntax to create functions');
    } else if (challenge.question.toLowerCase().includes('loop')) {
      keyPoints.push('Loops execute code repeatedly until a condition is met');
      keyPoints.push('Common loop types: for, while, do-while');
      keyPoints.push('Always ensure your loop has a proper exit condition to avoid infinite loops');
    } else if (challenge.question.toLowerCase().includes('array')) {
      keyPoints.push('Arrays are ordered collections of elements');
      keyPoints.push('Array indices start at 0');
      keyPoints.push('Use square brackets [] to access array elements');
    } else {
      keyPoints.push('Understanding this concept is fundamental to programming');
      keyPoints.push('Practice helps reinforce these concepts');
    }
  } else if (challenge.type === 'code-completion' || challenge.type === 'code-debug') {
    keyPoints.push('Read code carefully to understand its purpose');
    keyPoints.push('Check syntax and logical errors');
    keyPoints.push('Test your code with different inputs');
  }

  return keyPoints;
};

// Main migration function
async function addHintsAndSolutions() {
  try {
    console.log('🔄 Starting migration to add hints, solutions, and key points...\n');

    const games = await LearningGame.find({});
    console.log(`📊 Found ${games.length} games to update\n`);

    let totalChallengesUpdated = 0;

    for (const game of games) {
      let gameUpdated = false;

      for (const challenge of game.challenges) {
        let challengeUpdated = false;

        // Add hints if not present or empty
        if (!challenge.hints || challenge.hints.length === 0) {
          challenge.hints = generateHints(challenge);
          challengeUpdated = true;
        }

        // Add solution if not present
        if (!challenge.solution || challenge.solution === '') {
          challenge.solution = generateSolution(challenge);
          challengeUpdated = true;
        }

        // Add correctAnswer if not present (mainly for multiple choice)
        if (!challenge.correctAnswer || challenge.correctAnswer === '') {
          const correctOption = challenge.options?.find(opt => opt.isCorrect);
          if (correctOption) {
            challenge.correctAnswer = correctOption.text;
            challengeUpdated = true;
          }
        }

        // Add keyPoints if not present or empty
        if (!challenge.keyPoints || challenge.keyPoints.length === 0) {
          challenge.keyPoints = generateKeyPoints(challenge);
          challengeUpdated = true;
        }

        if (challengeUpdated) {
          totalChallengesUpdated++;
          gameUpdated = true;
        }
      }

      if (gameUpdated) {
        await game.save();
        console.log(`✅ Updated game: ${game.title} (${game.challenges.length} challenges)`);
      }
    }

    console.log(`\n✨ Migration completed!`);
    console.log(`📝 Total challenges updated: ${totalChallengesUpdated}`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the migration
addHintsAndSolutions();
