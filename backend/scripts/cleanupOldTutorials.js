require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

async function cleanup() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Get all programming tutorials
    const allTutorials = await MongoTutorial.find({
      category: 'Programming Fundamentals'
    }).lean();

    console.log(`Found ${allTutorials.length} programming tutorials`);

    // Delete tutorials that don't match the new format
    const toDelete = [];
    for (const tutorial of allTutorials) {
      const hasProperSlug = /^(javascript|python|java|typescript|c|cpp)-\d+-/.test(tutorial.slug);
      const hasThreeSteps = tutorial.steps && tutorial.steps.length === 3;

      if (!hasProperSlug || !hasThreeSteps) {
        toDelete.push(tutorial._id);
        console.log(`  Marking for deletion: ${tutorial.slug} (${tutorial.steps?.length || 0} steps)`);
      }
    }

    console.log(`\nDeleting ${toDelete.length} old/incomplete tutorials...`);

    if (toDelete.length > 0) {
      const result = await MongoTutorial.deleteMany({ _id: { $in: toDelete } });
      console.log(`✅ Deleted ${result.deletedCount} tutorials\n`);
    }

    // Final count by language
    console.log('📊 Final Tutorial Counts:');
    console.log('='.repeat(60));
    const languages = ['javascript', 'python', 'java', 'typescript', 'c', 'cpp'];

    for (const lang of languages) {
      const count = await MongoTutorial.countDocuments({
        category: 'Programming Fundamentals',
        language: lang
      });
      console.log(`${lang.toUpperCase().padEnd(12)}: ${count} tutorials`);
    }

    const final = await MongoTutorial.countDocuments({ category: 'Programming Fundamentals' });
    console.log('='.repeat(60));
    console.log(`TOTAL       : ${final} comprehensive tutorials\n`);

    mongoose.connection.close();
    console.log('✅ Cleanup complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanup();
