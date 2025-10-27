/**
 * Test script to check tutorial API response
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
require('dotenv').config();

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test finding a TypeScript tutorial
    const tutorial = await MongoTutorial.findOne({ slug: 'typescript-generics-utility-types' });

    if (!tutorial) {
      console.log('❌ No tutorial found');
      return;
    }

    console.log('📚 Tutorial found:');
    console.log('Title:', tutorial.title);
    console.log('Steps in DB:', tutorial.steps ? tutorial.steps.length : 0);
    console.log('Steps array exists:', !!tutorial.steps);

    if (tutorial.steps && tutorial.steps.length > 0) {
      const step = tutorial.steps[0];
      console.log('\n📌 First Step:');
      console.log('  Title:', step.title);
      console.log('  Has practicePhase:', !!step.practicePhase);
      console.log('  Has learnPhase:', !!step.learnPhase);
      console.log('  Has challengePhase:', !!step.challengePhase);

      if (step.practicePhase) {
        console.log('  Practice Instructions:', step.practicePhase.instructions?.length || 0);
      }
    }

    // Test what toJSON returns
    console.log('\n🔍 Testing toJSON():');
    const jsonData = tutorial.toJSON();
    console.log('Steps in JSON:', jsonData.steps ? jsonData.steps.length : 0);
    console.log('stepCount virtual:', jsonData.stepCount);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testAPI();
