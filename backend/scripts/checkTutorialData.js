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
    console.log('Slug:', tutorial.slug);
    console.log('\n=== PRACTICE STEP (Step 1) ===');
    console.log('Title:', tutorial.steps[1].title);
    console.log('StepNumber:', tutorial.steps[1].stepNumber);
    console.log('\nCodeExamples length:', tutorial.steps[1].codeExamples?.length);

    if (tutorial.steps[1].codeExamples && tutorial.steps[1].codeExamples[0]) {
      console.log('\n=== PRACTICE CODE ===');
      console.log(tutorial.steps[1].codeExamples[0].code);
    }

    console.log('\n=== Has practicePhase? ===');
    console.log('practicePhase exists:', tutorial.steps[1].practicePhase ? 'YES' : 'NO');
    if (tutorial.steps[1].practicePhase) {
      console.log('\nstarterCode:');
      console.log(tutorial.steps[1].practicePhase.starterCode);
    }
  }
  mongoose.connection.close();
});
