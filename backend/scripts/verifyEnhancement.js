/**
 * Verification script to check enhanced tutorial content across all types
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
const DatabaseTutorial = require('../models/DatabaseTutorial');
require('dotenv').config();

async function verifyEnhancements() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('='.repeat(70));
    console.log('TUTORIAL ENHANCEMENT VERIFICATION');
    console.log('='.repeat(70));

    // Check programming tutorials
    console.log('\n📖 PROGRAMMING TUTORIALS:');
    console.log('-'.repeat(70));

    const languages = ['python', 'javascript', 'typescript', 'java', 'cpp'];

    for (const lang of languages) {
      const tutorial = await MongoTutorial.findOne({ language: lang });
      if (tutorial && tutorial.steps.length > 0) {
        const step = tutorial.steps[0];
        console.log(`\n${lang.toUpperCase()}: ${tutorial.title}`);

        // Check practice phase
        if (step.practicePhase && step.practicePhase.instructions) {
          console.log(`  ✓ Instructions: ${step.practicePhase.instructions.length} steps`);
          console.log(`    - "${step.practicePhase.instructions[0].instruction.substring(0, 60)}..."`);
        } else {
          console.log('  ✗ Missing practice instructions');
        }

        // Check hints
        if (step.practicePhase && step.practicePhase.hints) {
          console.log(`  ✓ Hints: ${step.practicePhase.hints.length} levels`);
          console.log(`    - Level 1: "${step.practicePhase.hints[0].hint.substring(0, 55)}..."`);
        } else {
          console.log('  ✗ Missing hints');
        }

        // Check challenge
        if (step.challengePhase && step.challengePhase.problemStatement) {
          console.log(`  ✓ Challenge: "${step.challengePhase.problemStatement.substring(0, 60)}..."`);
          console.log(`    - Requirements: ${step.challengePhase.requirements ? step.challengePhase.requirements.length : 0}`);
          console.log(`    - Test Cases: ${step.challengePhase.testCases ? step.challengePhase.testCases.length : 0}`);
        } else {
          console.log('  ✗ Missing challenge phase');
        }
      }
    }

    // Check database tutorials
    console.log('\n\n🗄️  DATABASE TUTORIALS:');
    console.log('-'.repeat(70));

    const dbTypes = [
      { tag: 'mongodb', name: 'MongoDB' },
      { tag: 'sql', name: 'SQL' },
      { tag: 'postgresql', name: 'PostgreSQL' },
      { tag: 'redis', name: 'Redis' }
    ];

    for (const { tag, name } of dbTypes) {
      const tutorial = await DatabaseTutorial.findOne({ tags: tag });
      if (tutorial && tutorial.steps.length > 0) {
        const step = tutorial.steps[0];
        console.log(`\n${name}: ${tutorial.title}`);

        // Check practice phase
        if (step.practicePhase && step.practicePhase.instructions) {
          console.log(`  ✓ Instructions: ${step.practicePhase.instructions.length} steps`);
          console.log(`    - "${step.practicePhase.instructions[0].instruction.substring(0, 60)}..."`);
        } else {
          console.log('  ✗ Missing practice instructions');
        }

        // Check hints
        if (step.practicePhase && step.practicePhase.hints) {
          console.log(`  ✓ Hints: ${step.practicePhase.hints.length} levels`);
        } else {
          console.log('  ✗ Missing hints');
        }

        // Check challenge
        if (step.challengePhase && step.challengePhase.problemStatement) {
          console.log(`  ✓ Challenge: "${step.challengePhase.problemStatement.substring(0, 60)}..."`);
          console.log(`    - Requirements: ${step.challengePhase.requirements ? step.challengePhase.requirements.length : 0}`);
        } else {
          console.log('  ✗ Missing challenge phase');
        }
      }
    }

    // Overall statistics
    console.log('\n\n' + '='.repeat(70));
    console.log('STATISTICS:');
    console.log('='.repeat(70));

    const totalProgramming = await MongoTutorial.countDocuments();
    const totalDatabase = await DatabaseTutorial.countDocuments();

    // Check how many have proper enhancements
    const enhancedProgramming = await MongoTutorial.countDocuments({
      'steps.practicePhase.instructions': { $exists: true, $ne: [] }
    });

    const enhancedDatabase = await DatabaseTutorial.countDocuments({
      'steps.practicePhase.instructions': { $exists: true, $ne: [] }
    });

    console.log(`\nProgramming Tutorials: ${enhancedProgramming}/${totalProgramming} enhanced`);
    console.log(`Database Tutorials: ${enhancedDatabase}/${totalDatabase} enhanced`);
    console.log(`\nTotal Enhanced: ${enhancedProgramming + enhancedDatabase}/${totalProgramming + totalDatabase}`);

    const percentageComplete = Math.round(
      ((enhancedProgramming + enhancedDatabase) / (totalProgramming + totalDatabase)) * 100
    );

    console.log(`\nCompletion: ${percentageComplete}% ✅`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

verifyEnhancements();
