require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

async function duplicateChallenges() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get current count
    const currentCount = await CodingChallenge.countDocuments();
    console.log(`📊 Current challenges: ${currentCount}`);

    // Get max number
    const maxChallenge = await CodingChallenge.findOne().sort('-number');
    let nextNumber = maxChallenge ? maxChallenge.number + 1 : 101;
    console.log(`🔢 Starting new challenges from number: ${nextNumber}`);

    // Get all existing challenges
    const existingChallenges = await CodingChallenge.find().lean();
    console.log(`📥 Fetched ${existingChallenges.length} existing challenges`);

    // Create duplicates with new numbers and slugs
    const duplicates = existingChallenges.map((challenge, index) => {
      const newChallenge = { ...challenge };
      delete newChallenge._id;
      delete newChallenge.createdAt;
      delete newChallenge.updatedAt;
      delete newChallenge.__v;

      // Update number and slug
      newChallenge.number = nextNumber + index;
      newChallenge.slug = `${challenge.slug.replace(/-\d+$/, '')}-${newChallenge.number}`;

      // Add " II" or " III" to title if not already present
      if (!challenge.title.includes(' II') && !challenge.title.includes(' III')) {
        newChallenge.title = `${challenge.title} II`;
      } else if (challenge.title.includes(' II')) {
        newChallenge.title = challenge.title.replace(' II', ' III');
      }

      // Slightly modify the description
      newChallenge.description = `${challenge.description} (Advanced variant)`;

      // Clean up starterCode subdocuments
      if (newChallenge.starterCode) {
        newChallenge.starterCode = newChallenge.starterCode.map(sc => ({
          language: sc.language,
          code: sc.code,
          functionName: sc.functionName
        }));
      }

      // Clean up testCases subdocuments and filter out invalid ones
      if (newChallenge.testCases) {
        newChallenge.testCases = newChallenge.testCases
          .filter(tc => tc.input !== undefined && tc.input !== null && tc.expectedOutput !== undefined && tc.expectedOutput !== null)
          .map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden || false,
            explanation: tc.explanation
          }));
      }

      // Clean up other subdocuments
      if (newChallenge.hints) {
        newChallenge.hints = newChallenge.hints.map(h => ({
          order: h.order,
          text: h.text,
          cost: h.cost || 0
        }));
      }

      if (newChallenge.solutions) {
        newChallenge.solutions = newChallenge.solutions.map(s => ({
          language: s.language,
          code: s.code,
          explanation: s.explanation,
          timeComplexity: s.timeComplexity,
          spaceComplexity: s.spaceComplexity
        }));
      }

      return newChallenge;
    });

    console.log(`\n🔄 Creating ${duplicates.length} duplicate challenges...`);

    // Insert in batches to avoid overwhelming MongoDB
    const batchSize = 25;
    let inserted = 0;
    for (let i = 0; i < duplicates.length; i += batchSize) {
      const batch = duplicates.slice(i, i + batchSize);
      await CodingChallenge.insertMany(batch);
      inserted += batch.length;
      console.log(`   Inserted ${inserted}/${duplicates.length} challenges...`);
    }

    const newCount = await CodingChallenge.countDocuments();
    console.log(`\n✅ Successfully doubled challenges!`);
    console.log(`📊 Total challenges now: ${newCount}`);

    // Display summary
    const byDifficulty = await CodingChallenge.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byCategory = await CodingChallenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Difficulty Distribution:');
    byDifficulty.forEach(item => {
      console.log(`   ${item._id}: ${item.count} challenges`);
    });

    console.log('\n📈 By Category (Top 10):');
    byCategory.slice(0, 10).forEach(item => {
      console.log(`   ${item._id}: ${item.count} challenges`);
    });

    mongoose.connection.close();
    console.log('\n✨ Challenge doubling complete!');
  } catch (error) {
    console.error('❌ Error duplicating challenges:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  duplicateChallenges();
}

module.exports = duplicateChallenges;
