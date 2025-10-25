/**
 * AI-Enhanced Tutorial Structure Script
 * Generates meaningful, context-aware practice instructions and challenges
 * Works for ALL tutorial types (database, programming, etc.)
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
const DatabaseTutorial = require('../models/DatabaseTutorial');
require('dotenv').config();

// Intelligent content analysis and generation
function analyzeCodeContent(code, language) {
  const analysis = {
    hasFunction: /function|def |public |private /.test(code),
    hasLoop: /for |while |forEach|map\(/.test(code),
    hasConditional: /if |switch |case /.test(code),
    hasAsync: /async |await |Promise|\.then\(/.test(code),
    hasDatabase: /SELECT|INSERT|UPDATE|DELETE|db\.|collection\.|findOne|aggregate/.test(code),
    hasArray: /\[|\]|array|list/.test(code),
    hasObject: /\{|\}|object|dict|map/.test(code),
    variables: extractVariables(code),
    keywords: extractKeywords(code, language)
  };

  return analysis;
}

function extractVariables(code) {
  const patterns = [
    /(?:let|const|var)\s+(\w+)/g,
    /(\w+)\s*=/g,
    /def\s+(\w+)/g
  ];

  const vars = new Set();
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      if (match[1] && !['let', 'const', 'var', 'def', 'function'].includes(match[1])) {
        vars.add(match[1]);
      }
    }
  });

  return Array.from(vars).slice(0, 5);
}

function extractKeywords(code, language) {
  const keywords = new Set();

  // SQL keywords
  if (language === 'sql') {
    const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE'];
    sqlKeywords.forEach(kw => {
      if (code.toUpperCase().includes(kw)) keywords.add(kw);
    });
  }

  // JavaScript/TypeScript keywords
  if (['javascript', 'typescript'].includes(language)) {
    const jsKeywords = ['async', 'await', 'Promise', 'map', 'filter', 'reduce', 'forEach', 'class', 'extends'];
    jsKeywords.forEach(kw => {
      if (code.includes(kw)) keywords.add(kw);
    });
  }

  // Python keywords
  if (language === 'python') {
    const pyKeywords = ['def', 'class', 'import', 'lambda', 'list comprehension', 'with', 'try', 'except'];
    pyKeywords.forEach(kw => {
      if (code.includes(kw)) keywords.add(kw);
    });
  }

  return Array.from(keywords);
}

// Generate context-aware practice instructions
function generateSmartPracticeInstructions(step) {
  const codeExample = step.codeExamples?.[0];
  if (!codeExample) {
    return [
      {
        step: 1,
        instruction: `Study the ${step.title} concept and understand its purpose`,
        hint: 'Read through the explanation carefully and note key terminology'
      },
      {
        step: 2,
        instruction: 'Write your own implementation following the pattern explained',
        hint: 'Start with the basic structure and build up gradually'
      },
      {
        step: 3,
        instruction: 'Test your code with different inputs and edge cases',
        hint: 'Consider what happens with empty values, null, or extreme numbers'
      }
    ];
  }

  const analysis = analyzeCodeContent(codeExample.code, codeExample.language);
  const instructions = [];

  // Instruction 1: Based on code structure
  if (analysis.hasDatabase) {
    instructions.push({
      step: 1,
      instruction: `Set up your ${codeExample.language === 'sql' ? 'SQL query' : 'database connection'} following the example pattern`,
      hint: 'Pay attention to the database operations and their syntax'
    });
  } else if (analysis.hasFunction) {
    instructions.push({
      step: 1,
      instruction: 'Define the function signature with the correct parameters',
      hint: `Look at the example to identify what inputs the function needs`
    });
  } else {
    instructions.push({
      step: 1,
      instruction: 'Declare the necessary variables to store your data',
      hint: `Variables like ${analysis.variables.slice(0, 2).join(', ')} will help organize your code`
    });
  }

  // Instruction 2: Based on logic
  if (analysis.hasLoop) {
    instructions.push({
      step: 2,
      instruction: 'Implement the loop structure to iterate through the data',
      hint: 'Make sure your loop condition prevents infinite loops'
    });
  } else if (analysis.hasConditional) {
    instructions.push({
      step: 2,
      instruction: 'Add the conditional logic to handle different cases',
      hint: 'Think about all possible conditions and their outcomes'
    });
  } else if (analysis.keywords.length > 0) {
    instructions.push({
      step: 2,
      instruction: `Use ${analysis.keywords[0]} to implement the core logic`,
      hint: `The ${analysis.keywords[0]} keyword is crucial for this operation`
    });
  } else {
    instructions.push({
      step: 2,
      instruction: 'Write the main logic that processes the data',
      hint: 'Follow the sequence shown in the example code'
    });
  }

  // Instruction 3: Testing and output
  if (step.expectedOutput) {
    instructions.push({
      step: 3,
      instruction: 'Run your code and compare the output with the expected result',
      hint: `Expected output: ${step.expectedOutput.substring(0, 50)}...`
    });
  } else if (analysis.hasDatabase) {
    instructions.push({
      step: 3,
      instruction: 'Execute your query and verify the results are correct',
      hint: 'Check that the data structure matches what you expected'
    });
  } else {
    instructions.push({
      step: 3,
      instruction: 'Test your implementation with sample data and verify results',
      hint: 'Try both typical cases and edge cases to ensure robustness'
    });
  }

  return instructions;
}

// Generate smarter starter code
function generateSmartStarterCode(step) {
  const codeExample = step.codeExamples?.[0];
  if (!codeExample) {
    return `// Your code here\n// Implement ${step.title}\n\n`;
  }

  const code = codeExample.code;
  const language = codeExample.language;
  const lines = code.split('\n');

  let starterLines = [];
  let inFunction = false;
  let bracketCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Always keep comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#')) {
      starterLines.push(line);
      continue;
    }

    // Keep imports/requires
    if (trimmed.startsWith('import ') || trimmed.startsWith('require(') || trimmed.startsWith('from ')) {
      starterLines.push(line);
      continue;
    }

    // Keep function/class declarations but remove body
    if (trimmed.includes('function ') || trimmed.includes('def ') || trimmed.includes('class ') ||
        trimmed.includes('const ') && trimmed.includes('=>')) {
      starterLines.push(line);

      // If it's a function with body, add TODO
      if (line.includes('{')) {
        const indent = line.match(/^\s*/)[0];
        starterLines.push(`${indent}  // TODO: Implement this function`);
        starterLines.push(`${indent}  // Hint: ${codeExample.explanation || 'Follow the pattern from the example'}`);
        inFunction = true;
        bracketCount = 1;
      }
      continue;
    }

    // Track brackets to skip function bodies
    if (inFunction) {
      for (let char of line) {
        if (char === '{') bracketCount++;
        if (char === '}') bracketCount--;
      }

      if (bracketCount === 0) {
        starterLines.push(line); // closing bracket
        inFunction = false;
      }
      continue;
    }

    // For SQL, keep structure but remove specific values
    if (language === 'sql') {
      if (trimmed.toUpperCase().startsWith('SELECT') ||
          trimmed.toUpperCase().startsWith('FROM') ||
          trimmed.toUpperCase().startsWith('WHERE') ||
          trimmed.toUpperCase().startsWith('GROUP BY') ||
          trimmed.toUpperCase().startsWith('ORDER BY')) {
        // Replace specific column names with placeholders
        let modifiedLine = line.replace(/\w+\.\w+/g, '___.___ ');
        modifiedLine = modifiedLine.replace(/= ['"][\w\s]+['"]/g, "= '___'");
        modifiedLine = modifiedLine.replace(/= \d+/g, '= ___');
        starterLines.push(modifiedLine);
      } else {
        starterLines.push(line);
      }
      continue;
    }

    // For other languages, keep variable declarations but remove values
    if (trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('var ')) {
      const modifiedLine = line.replace(/=\s*[^;,]+/, '= /* TODO: Add value */');
      starterLines.push(modifiedLine);
      continue;
    }

    // Keep other structure
    if (trimmed === '' || trimmed === '{' || trimmed === '}' || trimmed === ');' || trimmed === ')') {
      starterLines.push(line);
    }
  }

  const starter = starterLines.join('\n');

  // If nothing was generated, provide a basic template
  if (starter.trim().length < 10) {
    return `// Implement ${step.title}\n// Follow the example from the Learn section\n\n`;
  }

  return starter;
}

// Generate context-aware hints
function generateSmartHints(step) {
  const codeExample = step.codeExamples?.[0];
  const hints = [];

  if (!codeExample) {
    return [
      { level: 1, hint: 'Break down the problem into smaller steps', unlocked: false },
      { level: 2, hint: 'Review the concept explanation for guidance', unlocked: false },
      { level: 3, hint: step.hints?.[0] || 'Try implementing one piece at a time', unlocked: false }
    ];
  }

  const analysis = analyzeCodeContent(codeExample.code, codeExample.language);

  // Hint 1: Structure-based
  if (analysis.hasDatabase) {
    hints.push({
      level: 1,
      hint: `Start by identifying which ${codeExample.language === 'sql' ? 'SQL clauses' : 'database methods'} you need`,
      unlocked: false
    });
  } else if (analysis.hasFunction) {
    hints.push({
      level: 1,
      hint: 'Define the function first, then worry about the implementation details',
      unlocked: false
    });
  } else {
    hints.push({
      level: 1,
      hint: 'Set up your data structures before implementing the logic',
      unlocked: false
    });
  }

  // Hint 2: Logic-based
  if (analysis.keywords.length > 0) {
    hints.push({
      level: 2,
      hint: `The key operation here is ${analysis.keywords[0]} - make sure you understand how it works`,
      unlocked: false
    });
  } else if (analysis.variables.length > 0) {
    hints.push({
      level: 2,
      hint: `Pay attention to variables like ${analysis.variables[0]} - they hold important data`,
      unlocked: false
    });
  } else {
    hints.push({
      level: 2,
      hint: 'Follow the same order of operations shown in the example',
      unlocked: false
    });
  }

  // Hint 3: Specific help
  if (step.hints && step.hints.length > 0) {
    hints.push({
      level: 3,
      hint: step.hints[0],
      unlocked: false
    });
  } else if (codeExample.explanation) {
    hints.push({
      level: 3,
      hint: `Remember: ${codeExample.explanation}`,
      unlocked: false
    });
  } else {
    hints.push({
      level: 3,
      hint: 'Compare your code line-by-line with the example to spot differences',
      unlocked: false
    });
  }

  return hints;
}

// Generate context-aware challenge
function generateSmartChallenge(step) {
  const codeExample = step.codeExamples?.[0];
  const title = step.title.toLowerCase();

  let problemStatement = '';
  let requirements = [];
  let testCases = [];

  // Generate based on content type
  if (!codeExample) {
    return {
      problemStatement: `Build a mini-project that demonstrates ${step.title}. Show that you understand the concepts and can apply them creatively.`,
      requirements: [
        'Implement the core functionality correctly',
        'Handle edge cases appropriately',
        'Write clean, readable code',
        'Test your solution thoroughly'
      ],
      testCases: [
        { input: 'Basic scenario', expected: 'Should work correctly', points: 15 },
        { input: 'Edge case', expected: 'Should handle gracefully', points: 10 }
      ]
    };
  }

  const analysis = analyzeCodeContent(codeExample.code, codeExample.language);

  // SQL/Database challenges
  if (analysis.hasDatabase) {
    if (codeExample.language === 'sql') {
      problemStatement = `Write a SQL query that extends the ${step.title} concept to solve a real business problem.`;
      requirements = [
        'Write efficient SQL with proper JOIN operations',
        'Use appropriate WHERE clauses to filter data',
        'Include GROUP BY if aggregating data',
        'Optimize for performance'
      ];
      testCases = [
        { input: 'Query execution', expected: 'Returns correct result set', points: 20 },
        { input: 'Performance test', expected: 'Executes in under 100ms', points: 10 }
      ];
    } else {
      problemStatement = `Create a database application that uses ${step.title} to manage data efficiently.`;
      requirements = [
        'Establish database connection properly',
        'Implement CRUD operations',
        'Handle errors gracefully',
        'Close connections appropriately'
      ];
      testCases = [
        { input: 'Create operation', expected: 'Data saved successfully', points: 10 },
        { input: 'Read operation', expected: 'Data retrieved correctly', points: 10 },
        { input: 'Error handling', expected: 'Handles failures gracefully', points: 5 }
      ];
    }
  }
  // Array/List processing
  else if (analysis.hasArray) {
    problemStatement = `Implement a function that processes an array of data using the ${step.title} technique in a practical scenario.`;
    requirements = [
      'Accept an array as input parameter',
      'Process each element correctly',
      'Return the transformed result',
      'Handle empty arrays'
    ];
    testCases = [
      { input: '[1, 2, 3, 4, 5]', expected: 'Correct transformation', points: 10 },
      { input: '[]', expected: 'Handles empty array', points: 5 },
      { input: '[complex data]', expected: 'Works with complex objects', points: 10 }
    ];
  }
  // Function/Algorithm challenges
  else if (analysis.hasFunction) {
    problemStatement = `Create a function that solves a real-world problem using the ${step.title} pattern.`;
    requirements = [
      'Define clear function signature',
      'Implement the core algorithm',
      'Return appropriate value',
      'Add input validation'
    ];
    testCases = [
      { input: 'Valid input', expected: 'Correct output', points: 15 },
      { input: 'Invalid input', expected: 'Throws error or returns null', points: 5 },
      { input: 'Edge case input', expected: 'Handles correctly', points: 5 }
    ];
  }
  // Async/Promise challenges
  else if (analysis.hasAsync) {
    problemStatement = `Build an asynchronous function that demonstrates ${step.title} in a practical API or data fetching scenario.`;
    requirements = [
      'Use async/await correctly',
      'Handle promise rejection',
      'Implement proper error handling',
      'Return appropriate data structure'
    ];
    testCases = [
      { input: 'Successful async call', expected: 'Resolves with data', points: 10 },
      { input: 'Failed async call', expected: 'Rejects with error', points: 10 },
      { input: 'Timeout scenario', expected: 'Handles gracefully', points: 5 }
    ];
  }
  // General code challenge
  else {
    problemStatement = `Apply the ${step.title} concept to build a small application or solve a coding problem.`;
    requirements = [
      'Implement the main functionality',
      'Follow best practices and conventions',
      'Write readable, maintainable code',
      'Add appropriate comments'
    ];
    testCases = [
      { input: 'Test case 1', expected: 'Produces correct result', points: 12 },
      { input: 'Test case 2', expected: 'Handles variation correctly', points: 8 },
      { input: 'Edge case', expected: 'Robust handling', points: 5 }
    ];
  }

  return { problemStatement, requirements, testCases };
}

// Enhanced step structure template
const createEnhancedStep = (originalStep, stepIndex) => {
  const challenge = generateSmartChallenge(originalStep);

  return {
    ...originalStep,

    // Phase 1: LEARN - Understanding the concept
    learnPhase: {
      conceptExplanation: originalStep.content || `Learn about ${originalStep.title}`,
      keyPoints: extractKeyPoints(originalStep.content),
      visualAid: {
        type: 'diagram',
        description: `Visual representation of ${originalStep.title}`,
        url: ''
      },
      realWorldExample: generateRealWorldExample(originalStep.title),
      whyItMatters: `Understanding ${originalStep.title} is essential for building robust applications and solving real-world problems effectively.`,
      commonMistakes: generateCommonMistakes(originalStep.title)
    },

    // Phase 2: PRACTICE - Guided coding
    practicePhase: {
      instructions: generateSmartPracticeInstructions(originalStep),
      starterCode: generateSmartStarterCode(originalStep),
      solution: originalStep.codeExamples?.[0]?.code || '',
      hints: generateSmartHints(originalStep),
      tests: generateTests(originalStep),
      helpfulResources: []
    },

    // Phase 3: CHALLENGE - Apply knowledge
    challengePhase: {
      problemStatement: challenge.problemStatement,
      difficulty: originalStep.difficulty || 'medium',
      requirements: challenge.requirements,
      testCases: challenge.testCases,
      bonusObjectives: []
    },

    estimatedTime: {
      learn: 5,
      practice: 10,
      challenge: 15
    },

    completionCriteria: {
      learnCompleted: false,
      practiceCompleted: false,
      challengeCompleted: false
    }
  };
};

// Helper functions from original script
function extractKeyPoints(content) {
  if (!content) return ['Core concept', 'Implementation', 'Best practices'];

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
    'select': 'Data reporting, business intelligence, customer analytics',
    'join': 'Combining customer and order data, product catalogs',
    'array': 'Shopping carts, playlist management, todo lists',
    'loop': 'Batch processing, data transformation, report generation',
    'function': 'Reusable components, API endpoints, utility libraries',
    'async': 'API calls, file operations, database queries',
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

      const enhancedSteps = tutorial.steps.map((step, index) =>
        createEnhancedStep(step, index)
      );

      tutorial.steps = enhancedSteps;

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

      const enhancedSteps = tutorial.steps.map((step, index) =>
        createEnhancedStep(step, index)
      );

      tutorial.steps = enhancedSteps;

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
