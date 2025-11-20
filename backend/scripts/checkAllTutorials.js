require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

async function checkAllTutorials() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Check Programming Fundamentals
    console.log('📚 PROGRAMMING FUNDAMENTALS TUTORIALS');
    console.log('='.repeat(70));

    const languages = ['javascript', 'python', 'java', 'typescript', 'c', 'cpp'];

    for (const lang of languages) {
      const tutorials = await MongoTutorial.find({
        category: 'Programming Fundamentals',
        language: lang
      });

      console.log(`\n${lang.toUpperCase()}:`);
      console.log(`  Total: ${tutorials.length} tutorials`);

      let hasThreeSteps = 0;
      let hasPracticeCode = 0;
      let hasChallengeCode = 0;

      for (const tutorial of tutorials) {
        if (tutorial.steps && tutorial.steps.length === 3) {
          hasThreeSteps++;

          // Check Practice step (index 1)
          if (tutorial.steps[1].codeExamples && tutorial.steps[1].codeExamples.length > 0) {
            const practiceCode = tutorial.steps[1].codeExamples[0].code;
            // Check if it's meaningful (not just a placeholder)
            if (practiceCode && practiceCode.length > 100 && !practiceCode.includes('Start coding here')) {
              hasPracticeCode++;
            }
          }

          // Check Challenge step (index 2)
          if (tutorial.steps[2].codeExamples && tutorial.steps[2].codeExamples.length > 0) {
            hasChallengeCode++;
          }
        }
      }

      console.log(`  ✓ Has 3 steps: ${hasThreeSteps}/${tutorials.length}`);
      console.log(`  ✓ Has meaningful practice code: ${hasPracticeCode}/${tutorials.length}`);
      console.log(`  ✓ Has challenge code: ${hasChallengeCode}/${tutorials.length}`);
    }

    // Check Database Tutorials
    console.log('\n\n📊 DATABASE TUTORIALS');
    console.log('='.repeat(70));

    const databaseTypes = [
      { name: 'SQL', filter: { category: 'Database', language: 'sql' } },
      { name: 'MONGODB', filter: { category: 'Database', language: 'javascript', slug: /^mongodb-/ } },
      { name: 'REDIS', filter: { category: 'Database', language: 'javascript', slug: /^redis-/ } }
    ];

    for (const dbType of databaseTypes) {
      const tutorials = await MongoTutorial.find(dbType.filter);

      console.log(`\n${dbType.name}:`);
      console.log(`  Total: ${tutorials.length} tutorials`);

      let hasThreeSteps = 0;
      let hasPracticeCode = 0;
      let hasChallengeCode = 0;

      for (const tutorial of tutorials) {
        if (tutorial.steps && tutorial.steps.length === 3) {
          hasThreeSteps++;

          // Check Practice step (index 1) - check practicePhase.starterCode first
          if (tutorial.steps[1].practicePhase && tutorial.steps[1].practicePhase.starterCode) {
            const practiceCode = tutorial.steps[1].practicePhase.starterCode;
            if (practiceCode && practiceCode.length > 100 && !practiceCode.includes('Start coding here')) {
              hasPracticeCode++;
            }
          } else if (tutorial.steps[1].codeExamples && tutorial.steps[1].codeExamples.length > 0) {
            const practiceCode = tutorial.steps[1].codeExamples[0].code;
            if (practiceCode && practiceCode.length > 100 && !practiceCode.includes('Start coding here')) {
              hasPracticeCode++;
            }
          }

          // Check Challenge step (index 2)
          if (tutorial.steps[2].codeExamples && tutorial.steps[2].codeExamples.length > 0) {
            hasChallengeCode++;
          }
        }
      }

      console.log(`  ✓ Has 3 steps: ${hasThreeSteps}/${tutorials.length}`);
      console.log(`  ✓ Has meaningful practice code: ${hasPracticeCode}/${tutorials.length}`);
      console.log(`  ✓ Has challenge code: ${hasChallengeCode}/${tutorials.length}`);
    }

    // Overall summary
    console.log('\n\n📈 OVERALL SUMMARY');
    console.log('='.repeat(70));

    const totalProgramming = await MongoTutorial.countDocuments({ category: 'Programming Fundamentals' });
    const totalDatabase = await MongoTutorial.countDocuments({ category: 'Database' });

    console.log(`Total Programming Tutorials: ${totalProgramming}`);
    console.log(`Total Database Tutorials: ${totalDatabase}`);
    console.log(`GRAND TOTAL: ${totalProgramming + totalDatabase} tutorials\n`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAllTutorials();
