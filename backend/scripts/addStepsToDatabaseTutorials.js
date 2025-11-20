require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Create a sample step structure for database tutorials
const createSampleSteps = (tutorial) => {
  const database = tutorial.tags[0]?.toUpperCase() || 'Database';
  const difficulty = tutorial.difficulty;

  return [
    {
      stepNumber: 1,
      title: `Introduction to ${tutorial.title.split(':')[1]?.trim() || 'Concept'}`,
      content: `Welcome to this tutorial on ${tutorial.title}! In this lesson, you will learn the fundamental concepts and practical applications.

## What You Will Learn

${tutorial.learningObjectives?.map((obj, i) => `${i + 1}. ${obj}`).join('\\n') || '- Core concepts\\n- Practical applications\\n- Best practices'}

## Why This Matters

Understanding ${tutorial.title.split(':')[1]?.trim() || 'this concept'} is crucial for working effectively with ${database}. This knowledge will help you build more efficient and scalable applications.

Let's get started!`,
      codeExamples: [
        {
          language: tutorial.language || 'javascript',
          code: `// ${tutorial.title}\n// This is a placeholder for the tutorial code example\n\n// TODO: Implement the example\nconsole.log('Welcome to ${tutorial.title}');`,
          explanation: 'This example demonstrates the basic syntax and usage patterns you will learn in this tutorial.'
        }
      ],
      hints: [
        'Take your time to understand each concept',
        'Practice with the code examples',
        'Refer to the documentation when needed'
      ],
      expectedOutput: '',
      isCompleted: false
    },
    {
      stepNumber: 2,
      title: 'Hands-On Practice',
      content: `Now that you understand the basics, let us put your knowledge into practice!

## Practice Exercise

Try implementing the concepts you have learned. ${difficulty === 'beginner' ? 'Start with simple examples and gradually increase complexity.' : difficulty === 'intermediate' ? 'Apply the concepts to real-world scenarios.' : 'Challenge yourself with advanced techniques and optimizations.'}

## Key Points to Remember

- Follow best practices
- Write clean, readable code
- Test your implementations
- Understand the underlying principles

Take your time and experiment with different approaches!`,
      codeExamples: [
        {
          language: tutorial.language || 'javascript',
          code: `// Practice Exercise\n// Implement what you've learned\n\n// Your code here\n`,
          explanation: 'Use this space to practice and experiment with the concepts.'
        }
      ],
      hints: [
        'Break down the problem into smaller steps',
        'Test incrementally as you build',
        'Review the examples from step 1 if needed'
      ],
      expectedOutput: '',
      isCompleted: false
    },
    {
      stepNumber: 3,
      title: 'Advanced Concepts & Best Practices',
      content: `Congratulations on making it this far! Let us explore some advanced concepts and industry best practices.

## Advanced Techniques

${difficulty === 'advanced' ?
  '- Performance optimization strategies\n- Scalability considerations\n- Security best practices\n- Production-ready patterns' :
  difficulty === 'intermediate' ?
  '- Optimization techniques\n- Common pitfalls to avoid\n- Real-world applications\n- Next steps for learning' :
  '- Building on the basics\n- Common patterns\n- Tips for improvement\n- Resources for further learning'
}

## Next Steps

Continue practicing and exploring ${database}. The more you work with it, the more proficient you will become!`,
      codeExamples: [
        {
          language: tutorial.language || 'javascript',
          code: `// Advanced Example\n// Best practices and patterns\n\n// Optimized approach\n// TODO: Implement advanced patterns\n`,
          explanation: 'This example shows advanced patterns and best practices used in production environments.'
        }
      ],
      hints: [
        'Consider performance implications',
        'Think about edge cases',
        'Review official documentation for advanced features'
      ],
      expectedOutput: '',
      isCompleted: false
    }
  ];
};

async function addStepsToDatabaseTutorials() {
  try {
    console.log('🚀 Starting to add steps to database tutorials...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find all database tutorials without steps
    const tutorials = await MongoTutorial.find({
      category: 'Database',
      $or: [
        { steps: { $exists: false } },
        { steps: { $size: 0 } }
      ]
    });

    console.log(`📚 Found ${tutorials.length} database tutorials without steps`);

    if (tutorials.length === 0) {
      console.log('✅ All database tutorials already have steps!');
      mongoose.connection.close();
      return;
    }

    let updated = 0;
    for (const tutorial of tutorials) {
      const steps = createSampleSteps(tutorial);
      tutorial.steps = steps;
      await tutorial.save();
      updated++;

      if (updated % 20 === 0) {
        console.log(`   Progress: ${updated}/${tutorials.length} tutorials updated`);
      }
    }

    console.log(`\n✅ Successfully added steps to ${updated} database tutorials`);
    console.log(`📊 Each tutorial now has 3 learning steps`);

    // Verify the update
    const tutorialsWithSteps = await MongoTutorial.countDocuments({
      category: 'Database',
      'steps.0': { $exists: true }
    });

    console.log(`\n✨ Verification: ${tutorialsWithSteps} database tutorials now have steps`);

    mongoose.connection.close();
    console.log('\n🎉 Process complete!');
  } catch (error) {
    console.error('❌ Error adding steps to database tutorials:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addStepsToDatabaseTutorials();
}

module.exports = addStepsToDatabaseTutorials;
