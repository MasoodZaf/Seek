const MongoTutorial = require('../models/MongoTutorial');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform').then(async () => {
  const tutorial = await MongoTutorial.findOne({
    category: 'Programming Fundamentals',
    language: 'javascript',
    slug: /variables-and-data-types/
  });

  if (tutorial && tutorial.steps && tutorial.steps[1]) {
    console.log('Tutorial:', tutorial.title);
    console.log('\n=== PRACTICE STEP ===');

    const practiceStep = tutorial.steps[1];

    console.log('Has practicePhase:', !!practiceStep.practicePhase);

    if (practiceStep.practicePhase) {
      console.log('\npracticePhase object:');
      console.log(JSON.stringify(practiceStep.practicePhase, null, 2));
    }

    console.log('\nCodeExamples[0].code (first 200 chars):');
    if (practiceStep.codeExamples && practiceStep.codeExamples[0]) {
      console.log(practiceStep.codeExamples[0].code.substring(0, 200));
    }
  }
  mongoose.connection.close();
});
