const CodingChallenge = require('../models/CodingChallenge');
const UserSkillProfile = require('../models/UserSkillProfile');
const ChallengeSubmission = require('../models/ChallengeSubmission');

class ChallengeRecommendationService {
  /**
   * Get personalized challenge recommendations for a user
   * @param {String} userId - User ID
   * @param {Number} count - Number of recommendations (default: 10)
   * @returns {Array} - Array of recommended challenges
   */
  async getRecommendations(userId, count = 10) {
    try {
      // Get or create user skill profile
      let skillProfile = await UserSkillProfile.findOne({ userId });

      if (!skillProfile) {
        skillProfile = await this.createInitialProfile(userId);
      }

      // Update overall level
      await skillProfile.calculateOverallLevel();
      await skillProfile.identifyStrengthsAndWeaknesses();
      await skillProfile.save();

      // Get solved challenge IDs
      const solvedChallenges = await ChallengeSubmission.find({
        userId,
        status: 'accepted'
      }).distinct('challengeId');

      // Build recommendation query
      const recommendations = await this._buildRecommendationQuery(
        skillProfile,
        solvedChallenges,
        count
      );

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  /**
   * Build intelligent recommendation query based on user skill
   */
  async _buildRecommendationQuery(skillProfile, solvedChallengeIds, count) {
    const userLevel = skillProfile.overallLevel;

    // Determine skill level range (allow slight challenge)
    const minSkillLevel = Math.max(1, userLevel - 1);
    const maxSkillLevel = Math.min(10, userLevel + 2);

    // 70% problems at user level, 20% slightly harder, 10% review easier
    const distribution = {
      current: Math.ceil(count * 0.7),
      challenge: Math.ceil(count * 0.2),
      review: Math.floor(count * 0.1)
    };

    const recommendations = [];

    // Get current level challenges
    const currentLevelChallenges = await CodingChallenge.aggregate([
      {
        $match: {
          _id: { $nin: solvedChallengeIds.map(id => id) },
          skillLevel: { $gte: userLevel - 0.5, $lte: userLevel + 0.5 },
          ...this._getTopicPreferenceFilter(skillProfile)
        }
      },
      { $sample: { size: distribution.current } }
    ]);

    recommendations.push(...currentLevelChallenges);

    // Get challenge level (slightly harder)
    if (distribution.challenge > 0) {
      const challengeLevelChallenges = await CodingChallenge.aggregate([
        {
          $match: {
            _id: { $nin: [...solvedChallengeIds, ...recommendations.map(r => r._id)] },
            skillLevel: { $gt: userLevel + 0.5, $lte: maxSkillLevel }
          }
        },
        { $sample: { size: distribution.challenge } }
      ]);

      recommendations.push(...challengeLevelChallenges);
    }

    // Get review level (easier problems in weak areas)
    if (distribution.review > 0 && skillProfile.weakTopics.length > 0) {
      const reviewChallenges = await CodingChallenge.aggregate([
        {
          $match: {
            _id: { $nin: [...solvedChallengeIds, ...recommendations.map(r => r._id)] },
            skillLevel: { $gte: minSkillLevel, $lt: userLevel - 0.5 },
            category: { $in: skillProfile.weakTopics }
          }
        },
        { $sample: { size: distribution.review } }
      ]);

      recommendations.push(...reviewChallenges);
    }

    // If we don't have enough, fill with random unsolved challenges
    if (recommendations.length < count) {
      const remaining = count - recommendations.length;
      const fillerChallenges = await CodingChallenge.aggregate([
        {
          $match: {
            _id: { $nin: [...solvedChallengeIds, ...recommendations.map(r => r._id)] },
            skillLevel: { $gte: minSkillLevel, $lte: maxSkillLevel }
          }
        },
        { $sample: { size: remaining } }
      ]);

      recommendations.push(...fillerChallenges);
    }

    // Shuffle recommendations for variety
    return this._shuffleArray(recommendations).slice(0, count);
  }

  /**
   * Get topic preference filter based on user's skill profile
   */
  _getTopicPreferenceFilter(skillProfile) {
    const filter = {};

    // Prefer categories user wants to practice
    if (skillProfile.challengePreferences.categories.length > 0) {
      filter.category = { $in: skillProfile.challengePreferences.categories };
    }

    // Avoid categories user doesn't want
    if (skillProfile.challengePreferences.avoidCategories.length > 0) {
      filter.category = {
        ...filter.category,
        $nin: skillProfile.challengePreferences.avoidCategories
      };
    }

    // Include target company problems if specified
    if (skillProfile.challengePreferences.targetCompanies.length > 0) {
      filter.companies = { $in: skillProfile.challengePreferences.targetCompanies };
    }

    return filter;
  }

  /**
   * Create initial skill profile for new user
   */
  async createInitialProfile(userId) {
    const profile = new UserSkillProfile({
      userId,
      overallLevel: 1,
      topicMastery: [],
      initialAssessmentCompleted: false
    });

    await profile.save();
    return profile;
  }

  /**
   * Update skill profile after challenge submission
   */
  async updateSkillProfile(userId, challengeId, success) {
    try {
      const profile = await UserSkillProfile.findOne({ userId });
      if (!profile) return;

      const challenge = await CodingChallenge.findById(challengeId);
      if (!challenge) return;

      // Update topic mastery
      profile.updateTopicMastery(challenge.category, success);

      // Update overall stats
      profile.totalChallengesSolved += success ? 1 : 0;
      if (success) {
        if (challenge.difficulty === 'easy') profile.easySolved += 1;
        if (challenge.difficulty === 'medium') profile.mediumSolved += 1;
        if (challenge.difficulty === 'hard') profile.hardSolved += 1;
      }

      profile.lastActiveDate = new Date();
      await profile.save();
    } catch (error) {
      console.error('Error updating skill profile:', error);
    }
  }

  /**
   * Get next challenge for assessment
   */
  async getAssessmentChallenge(userId, questionNumber) {
    // Simple 5-question assessment covering different topics and difficulties
    const assessmentTopics = ['Array', 'String', 'Math', 'Hash Table', 'Dynamic Programming'];
    const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard'];

    const topic = assessmentTopics[questionNumber % assessmentTopics.length];
    const difficulty = difficulties[questionNumber % difficulties.length];

    const challenge = await CodingChallenge.findOne({
      category: topic,
      difficulty,
      skillLevel: { $lte: 5 } // Use beginner-friendly problems for assessment
    });

    return challenge;
  }

  /**
   * Complete initial assessment and set user level
   */
  async completeAssessment(userId, results) {
    const profile = await UserSkillProfile.findOne({ userId });
    if (!profile) return;

    // Calculate assessment score
    const correctAnswers = results.filter(r => r.correct).length;
    const score = (correctAnswers / results.length) * 100;

    // Set initial level based on assessment
    let initialLevel = 1;
    if (score >= 80) initialLevel = 5;
    else if (score >= 60) initialLevel = 4;
    else if (score >= 40) initialLevel = 3;
    else if (score >= 20) initialLevel = 2;

    profile.overallLevel = initialLevel;
    profile.assessmentScore = score;
    profile.assessmentDate = new Date();
    profile.initialAssessmentCompleted = true;

    // Initialize topic mastery from assessment
    results.forEach(result => {
      if (result.topic) {
        profile.updateTopicMastery(result.topic, result.correct);
      }
    });

    await profile.save();
    return profile;
  }

  /**
   * Shuffle array helper
   */
  _shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get daily challenge (one per day, adapts to user level)
   */
  async getDailyChallenge(userId) {
    const profile = await UserSkillProfile.findOne({ userId });
    if (!profile) {
      return await CodingChallenge.findOne({ difficulty: 'easy', skillLevel: { $lte: 2 } });
    }

    // Use date as seed for consistent daily challenge
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const userLevel = profile.overallLevel;
    const challenges = await CodingChallenge.find({
      skillLevel: { $gte: userLevel - 1, $lte: userLevel + 1 }
    });

    if (challenges.length === 0) {
      return await CodingChallenge.findOne({ difficulty: 'medium' });
    }

    return challenges[seed % challenges.length];
  }
}

module.exports = new ChallengeRecommendationService();
