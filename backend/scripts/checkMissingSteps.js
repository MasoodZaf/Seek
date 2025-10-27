/**
 * Check which tutorials are missing steps
 */

const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
require('dotenv').config();

async function checkMissingSteps() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all tutorials
    const allTutorials = await MongoTutorial.find({});
    console.log(`Total tutorials: ${allTutorials.length}`);

    // Group by language
    const byLanguage = {};
    allTutorials.forEach(t => {
      if (!byLanguage[t.language]) {
        byLanguage[t.language] = { total: 0, withSteps: 0, withoutSteps: 0, titles: [] };
      }
      byLanguage[t.language].total++;
      if (t.steps && t.steps.length > 0) {
        byLanguage[t.language].withSteps++;
      } else {
        byLanguage[t.language].withoutSteps++;
        byLanguage[t.language].titles.push(t.title);
      }
    });

    console.log('\n📊 TUTORIAL STATUS BY LANGUAGE:');
    console.log('='.repeat(70));

    Object.keys(byLanguage).sort().forEach(lang => {
      const stats = byLanguage[lang];
      console.log(`\n${lang.toUpperCase()}:`);
      console.log(`  Total: ${stats.total}`);
      console.log(`  With Steps: ${stats.withSteps} ✅`);
      console.log(`  Without Steps: ${stats.withoutSteps} ❌`);

      if (stats.titles.length > 0) {
        console.log(`  Missing steps:`);
        stats.titles.forEach(title => {
          console.log(`    - ${title}`);
        });
      }
    });

    // Find tutorials without any steps
    const tutorialsWithoutSteps = allTutorials.filter(t => !t.steps || t.steps.length === 0);
    console.log(`\n\n⚠️  ${tutorialsWithoutSteps.length} tutorials have NO steps`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkMissingSteps();
