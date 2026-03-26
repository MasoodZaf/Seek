/**
 * Challenge Auto-Seeder
 * Called at startup: checks if challenges are present in MongoDB and seeds them if not.
 * Safe to call repeatedly — uses upsert-style logic (no duplicates).
 */
const CodingChallenge = require('../models/CodingChallenge');
const logger = require('../config/logger');

async function autoSeedChallenges() {
  try {
    // Lazy-require so batch files only load their data arrays (not their DB connection code)
    const { challenges: batch1 } = require('../scripts/seedBatch1');
    const { challenges: batch2 } = require('../scripts/seedBatch2');
    const { challenges: batch3 } = require('../scripts/seedBatch3');
    const { challenges: batch4 } = require('../scripts/seedBatch4');

    const allChallenges = [...batch1, ...batch2, ...batch3, ...batch4];
    const expected = allChallenges.length;

    const current = await CodingChallenge.countDocuments();
    if (current >= expected) {
      logger.info(`✅ Challenges already seeded (${current}/${expected})`);
      return;
    }

    logger.info(`🌱 Auto-seeding challenges (${current}/${expected} present)...`);
    let added = 0;

    for (const ch of allChallenges) {
      const exists = await CodingChallenge.findOne({
        $or: [{ slug: ch.slug }, { number: ch.number }]
      });
      if (!exists) {
        await CodingChallenge.create({
          ...ch,
          totalSubmissions: ch.totalSubmissions || 0,
          totalAccepted: ch.totalAccepted || 0
        });
        added++;
      }
    }

    logger.info(`✅ Challenge seeding complete. Added: ${added}, Total: ${current + added}/${expected}`);
  } catch (error) {
    logger.warn('⚠️  Challenge auto-seed failed (non-fatal):', error.message);
  }
}

module.exports = { autoSeedChallenges };
