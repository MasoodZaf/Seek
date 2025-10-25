/**
 * Test script to verify enhanced tutorial structure
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
require('dotenv').config();

async function testEnhancement() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find one Redis tutorial
    const tutorial = await MongoTutorial.findOne({ tags: 'redis' });

    if (!tutorial) {
      console.log('❌ No Redis tutorial found');
      return;
    }

    console.log('\n📚 Tutorial:', tutorial.title);
    console.log('📝 Slug:', tutorial.slug);
    console.log('🔢 Steps count:', tutorial.steps.length);

    if (tutorial.steps.length > 0) {
      const step = tutorial.steps[0];
      console.log('\n📌 First Step:', step.title);
      console.log('\n--- Learn Phase ---');
      console.log('Concept Explanation:', step.learnPhase?.conceptExplanation?.substring(0, 100));
      console.log('Key Points:', step.learnPhase?.keyPoints?.length || 0);
      console.log('Real World Example:', step.learnPhase?.realWorldExample?.substring(0, 100));

      console.log('\n--- Practice Phase ---');
      console.log('Instructions:', step.practicePhase?.instructions?.length || 0);
      console.log('Starter Code:', step.practicePhase?.starterCode ? 'EXISTS' : 'MISSING');
      console.log('Solution:', step.practicePhase?.solution ? 'EXISTS' : 'MISSING');
      console.log('Hints:', step.practicePhase?.hints?.length || 0);

      console.log('\n--- Challenge Phase ---');
      console.log('Problem Statement:', step.challengePhase?.problemStatement?.substring(0, 100));
      console.log('Requirements:', step.challengePhase?.requirements?.length || 0);
      console.log('Test Cases:', step.challengePhase?.testCases?.length || 0);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testEnhancement();
