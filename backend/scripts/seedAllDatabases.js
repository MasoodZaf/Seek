require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Tutorial = require('../models/Tutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Import tutorial data
const mongodbTutorials = require('./data/mongodb-tutorials');
const sqlTutorials = require('./data/sql-tutorials');
const postgresqlTutorials = require('./data/postgresql-tutorials');
const redisTutorials = require('./data/redis-tutorials');

async function seedAllDatabases() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Delete existing database tutorials
    const deleteResult = await Tutorial.deleteMany({
      category: 'Database'
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing database tutorials`);

    // Combine all tutorials
    const allTutorials = [
      ...mongodbTutorials,
      ...sqlTutorials,
      ...postgresqlTutorials,
      ...redisTutorials
    ];

    // Insert new tutorials
    const result = await Tutorial.insertMany(allTutorials);
    console.log(`\n✅ Successfully seeded ${result.length} database tutorials`);

    // Display summary
    const summary = {
      MongoDB: mongodbTutorials.length,
      'SQL/MySQL': sqlTutorials.length,
      PostgreSQL: postgresqlTutorials.length,
      Redis: redisTutorials.length
    };

    console.log('\n📊 Tutorial Summary by Database:');
    Object.entries(summary).forEach(([db, count]) => {
      console.log(`   ${db}: ${count} tutorials`);
    });

    console.log('\n📈 Difficulty Breakdown:');
    const byDifficulty = allTutorials.reduce((acc, t) => {
      acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
      return acc;
    }, {});
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      console.log(`   ${diff}: ${count} tutorials`);
    });

    mongoose.connection.close();
    console.log('\n✨ Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database tutorials:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAllDatabases();
}

module.exports = seedAllDatabases;
