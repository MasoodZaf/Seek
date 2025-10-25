/**
 * Enhanced Tutorial Structure Script
 * Adds interactive learning phases to existing tutorials
 * Works for ALL tutorial types (database, programming, etc.)
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
const DatabaseTutorial = require('../models/DatabaseTutorial');
require('dotenv').config();

// Enhanced step structure template
const createEnhancedStep = (originalStep, stepIndex) => {
  return {
    ...originalStep,

    // Phase 1: LEARN - Understanding the concept
    learnPhase: {
      conceptExplanation: originalStep.content || `Learn about ${originalStep.title}`,
      keyPoints: extractKeyPoints(originalStep.content),
      visualAid: {
        type: 'diagram', // diagram, animation, flowchart
        description: `Visual representation of ${originalStep.title}`,
        url: '' // Can be added later
      },
      realWorldExample: generateRealWorldExample(originalStep.title),
      whyItMatters: `Understanding ${originalStep.title} helps you build better applications.`,
      commonMistakes: generateCommonMistakes(originalStep.title)
    },

    // Phase 2: PRACTICE - Guided coding
    practicePhase: {
      instructions: generatePracticeInstructions(originalStep),
      starterCode: generateStarterCode(originalStep),
      solution: originalStep.codeExamples?.[0]?.code || '',
      hints: enhanceHints(originalStep.hints || []),
      tests: generateTests(originalStep),
      helpfulResources: []
    },

    // Phase 3: CHALLENGE - Apply knowledge
    challengePhase: {
      problemStatement: generateChallenge(originalStep),
      difficulty: originalStep.difficulty || 'medium',
      requirements: generateRequirements(originalStep),
      testCases: generateTestCases(originalStep),
      bonusObjectives: []
    },

    // Enhanced metadata
    estimatedTime: {
      learn: 5, // minutes
      practice: 10,
      challenge: 15
    },

    // Progress tracking
    completionCriteria: {
      learnCompleted: false,
      practiceCompleted: false,
      challengeCompleted: false
    }
  };
};

// Helper functions
function extractKeyPoints(content) {
  if (!content) return ['Core concept', 'Implementation', 'Best practices'];

  // Extract sentences that seem important (contain keywords)
  const keywords = ['important', 'key', 'remember', 'note', 'allows', 'enables'];
  const sentences = content.split('.').filter(s => s.trim().length > 0);

  const keyPoints = sentences
    .filter(s => keywords.some(kw => s.toLowerCase().includes(kw)))
    .map(s => s.trim())
    .slice(0, 3);

  return keyPoints.length > 0 ? keyPoints : [
    'Understand the core concept',
    'Learn the syntax and usage',
    'Apply in real scenarios'
  ];
}

function generateRealWorldExample(title) {
  const examples = {
    'sorted sets': 'Gaming leaderboards, ranking systems, priority queues',
    'indexing': 'Database optimization, faster queries, improved performance',
    'window': 'Analytics dashboards, moving averages, trend analysis',
    'replication': 'High availability systems, disaster recovery, data redundancy',
    'default': 'Production applications, scalable systems, enterprise software'
  };

  const key = Object.keys(examples).find(k => title.toLowerCase().includes(k));
  return examples[key] || examples.default;
}

function generateCommonMistakes(title) {
  return [
    'Not understanding the use case properly',
    'Forgetting to handle edge cases',
    'Not considering performance implications'
  ];
}

function generatePracticeInstructions(step) {
  const baseInstructions = [
    {
      step: 1,
      instruction: `Read the concept explanation above`,
      hint: 'Understanding the theory helps with implementation'
    },
    {
      step: 2,
      instruction: `Complete the code below based on the example`,
      hint: 'Follow the pattern shown in the Learn section'
    },
    {
      step: 3,
      instruction: `Run your code and verify the output`,
      hint: 'Check the expected output to validate your solution'
    }
  ];

  return baseInstructions;
}

function generateStarterCode(step) {
  if (!step.codeExamples || step.codeExamples.length === 0) {
    return '// Write your code here\n\n';
  }

  const fullCode = step.codeExamples[0].code;

  // Create starter code by replacing key parts with placeholders
  const starterCode = fullCode
    .split('\n')
    .map(line => {
      // Keep comments
      if (line.trim().startsWith('//')) return line;

      // Replace function bodies with TODO
      if (line.includes('{') && !line.includes('}')) {
        return line + '\n  // TODO: Implement this';
      }

      // Replace values with blanks for students to fill
      if (line.includes('=') && !line.includes('===') && !line.includes('!==')) {
        return line.replace(/=\s*[^;,}]+/, '= ____');
      }

      return line;
    })
    .join('\n');

  return starterCode;
}

function enhanceHints(originalHints) {
  const baseHints = [
    {
      level: 1,
      hint: 'Review the example in the Learn section',
      unlocked: false
    },
    {
      level: 2,
      hint: 'Check the syntax carefully - pay attention to method names',
      unlocked: false
    },
    {
      level: 3,
      hint: originalHints[0] || 'Look at the expected output format',
      unlocked: false
    }
  ];

  return baseHints;
}

function generateTests(step) {
  return [
    {
      name: 'Syntax Check',
      description: 'Code has no syntax errors',
      type: 'syntax'
    },
    {
      name: 'Output Check',
      description: 'Produces expected output',
      type: 'output',
      expected: step.expectedOutput || ''
    },
    {
      name: 'Best Practices',
      description: 'Follows coding best practices',
      type: 'quality'
    }
  ];
}

function generateChallenge(step) {
  return `Apply what you learned about ${step.title} to solve a real-world problem. Build a mini-project that demonstrates your understanding.`;
}

function generateRequirements(step) {
  return [
    'Implement the core functionality',
    'Handle edge cases properly',
    'Write clean, readable code',
    'Test your solution thoroughly'
  ];
}

function generateTestCases(step) {
  return [
    {
      input: 'Basic scenario',
      expected: 'Should work correctly',
      points: 10
    },
    {
      input: 'Edge case',
      expected: 'Should handle gracefully',
      points: 5
    }
  ];
}

// Main enhancement function
async function enhanceAllTutorials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Get all MongoTutorials (programming tutorials)
    const mongoTutorials = await MongoTutorial.find({});
    console.log(`📚 Found ${mongoTutorials.length} programming tutorials to enhance`);

    let enhanced = 0;

    for (const tutorial of mongoTutorials) {
      console.log(`\n🔄 Enhancing: ${tutorial.title}`);

      // Enhance each step
      const enhancedSteps = tutorial.steps.map((step, index) =>
        createEnhancedStep(step, index)
      );

      tutorial.steps = enhancedSteps;

      // Add tutorial-level enhancements
      tutorial.learningObjectives = tutorial.learningObjectives || [
        `Understand ${tutorial.title}`,
        'Apply concepts in practice',
        'Build real-world projects'
      ];

      await tutorial.save();
      enhanced++;
      console.log(`   ✅ Enhanced ${tutorial.title}`);
    }

    // Get all DatabaseTutorials
    const dbTutorials = await DatabaseTutorial.find({});
    console.log(`\n📚 Found ${dbTutorials.length} database tutorials to enhance`);

    for (const tutorial of dbTutorials) {
      console.log(`\n🔄 Enhancing: ${tutorial.title}`);

      // Enhance each step
      const enhancedSteps = tutorial.steps.map((step, index) =>
        createEnhancedStep(step, index)
      );

      tutorial.steps = enhancedSteps;

      // Add tutorial-level enhancements
      tutorial.learningObjectives = tutorial.learningObjectives || [
        `Understand ${tutorial.title}`,
        'Apply concepts in practice',
        'Build real-world projects'
      ];

      await tutorial.save();
      enhanced++;
      console.log(`   ✅ Enhanced ${tutorial.title}`);
    }

    console.log(`\n🎉 Successfully enhanced ${enhanced} total tutorials!`);
    console.log(`   📖 Programming: ${mongoTutorials.length}`);
    console.log(`   🗄️  Database: ${dbTutorials.length}`);

  } catch (error) {
    console.error('❌ Error enhancing tutorials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  enhanceAllTutorials();
}

module.exports = { enhanceAllTutorials, createEnhancedStep };
