/**
 * Add missing steps to TypeScript and Java tutorials
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
require('dotenv').config();

// Helper function to create basic tutorial steps based on language/topic
function createDefaultSteps(tutorial) {
  const language = tutorial.language;
  const title = tutorial.title;

  // Create 3-5 steps based on the tutorial title
  const steps = [];

  if (language === 'typescript' || language === 'java') {
    // Step 1: Introduction
    steps.push({
      stepNumber: 1,
      title: `Introduction to ${title.split(':')[1]?.trim() || title}`,
      content: `Let's learn about ${title.toLowerCase()}. This concept is fundamental to writing effective ${language} code.`,
      codeExamples: [{
        language: language === 'typescript' ? 'typescript' : 'java',
        code: `// ${title}\n// This is an introductory example\n\nfunction example() {\n  console.log("Hello from ${language}!");\n}`,
        explanation: 'Basic example demonstrating the concept',
        isExecutable: true
      }],
      hints: [`Start by understanding the basics`, `Review the syntax carefully`],
      expectedOutput: 'Understanding of core concepts',
      isCompleted: false
    });

    // Step 2: Core Concepts
    steps.push({
      stepNumber: 2,
      title: `Core Concepts`,
      content: `Now let's dive deeper into the core concepts and syntax.`,
      codeExamples: [{
        language: language === 'typescript' ? 'typescript' : 'java',
        code: `// Core implementation\n// Apply the concepts learned\n\nfunction advancedExample() {\n  // Implementation here\n  return true;\n}`,
        explanation: 'Applying the concepts in practice',
        isExecutable: true
      }],
      hints: [`Focus on understanding the structure`, `Pay attention to types and syntax`],
      expectedOutput: 'Working implementation',
      isCompleted: false
    });

    // Step 3: Practical Application
    steps.push({
      stepNumber: 3,
      title: `Practical Application`,
      content: `Let's apply what we've learned to solve a real-world problem.`,
      codeExamples: [{
        language: language === 'typescript' ? 'typescript' : 'java',
        code: `// Real-world application\n// Solve a practical problem\n\nfunction solution() {\n  // Your solution here\n  return "Success!";\n}`,
        explanation: 'Complete practical example',
        isExecutable: true
      }],
      hints: [`Think about real-world use cases`, `Consider edge cases`],
      expectedOutput: 'Complete working solution',
      isCompleted: false
    });
  }

  return steps;
}

async function addMissingSteps() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all tutorials without steps
    const tutorialsWithoutSteps = await MongoTutorial.find({
      $or: [
        { steps: { $exists: false } },
        { steps: { $size: 0 } }
      ]
    });

    console.log(`Found ${tutorialsWithoutSteps.length} tutorials without steps\n`);

    let updated = 0;

    for (const tutorial of tutorialsWithoutSteps) {
      console.log(`🔧 Adding steps to: ${tutorial.title}`);

      // Create default steps
      const steps = createDefaultSteps(tutorial);
      tutorial.steps = steps;

      // Save the tutorial
      await tutorial.save();
      updated++;
      console.log(`   ✅ Added ${steps.length} steps`);
    }

    console.log(`\n🎉 Successfully added steps to ${updated} tutorials!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

addMissingSteps();
