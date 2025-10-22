import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  SparklesIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Card, TutorialCard, Button, Badge } from './';

const RecommendationEngine = ({
  userProfile,
  userProgress,
  tutorials = [],
  maxRecommendations = 6,
  className,
  onTutorialClick,
  ...props
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const recommendationCategories = [
    { id: 'all', label: 'All Recommendations', icon: SparklesIcon },
    { id: 'personalized', label: 'For You', icon: LightBulbIcon },
    { id: 'trending', label: 'Trending', icon: ArrowTrendingUpIcon },
    { id: 'popular', label: 'Popular', icon: UserGroupIcon },
    { id: 'quick', label: 'Quick Wins', icon: ClockIcon },
    { id: 'advanced', label: 'Level Up', icon: StarIcon },
  ];

  useEffect(() => {
    generateRecommendations();
  }, [userProfile, userProgress, tutorials, selectedCategory]);

  const generateRecommendations = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...tutorials];
      
      // Apply category-specific logic
      switch (selectedCategory) {
        case 'personalized':
          filtered = getPersonalizedRecommendations(filtered);
          break;
        case 'trending':
          filtered = getTrendingRecommendations(filtered);
          break;
        case 'popular':
          filtered = getPopularRecommendations(filtered);
          break;
        case 'quick':
          filtered = getQuickWinRecommendations(filtered);
          break;
        case 'advanced':
          filtered = getAdvancedRecommendations(filtered);
          break;
        default:
          filtered = getAllRecommendations(filtered);
      }
      
      setRecommendations(filtered.slice(0, maxRecommendations));
      setLoading(false);
    }, 500);
  };

  const getPersonalizedRecommendations = (tutorials) => {
    // Mock personalization logic based on user profile and progress
    const userLanguages = userProgress?.languages || ['javascript'];
    const userLevel = userProfile?.level || 'beginner';
    const completedTutorials = userProgress?.completed || [];
    
    return tutorials
      .filter(tutorial => !completedTutorials.includes(tutorial.id))
      .filter(tutorial => userLanguages.includes(tutorial.language))
      .filter(tutorial => {
        if (userLevel === 'beginner') return tutorial.difficulty === 'beginner';
        if (userLevel === 'intermediate') return ['beginner', 'intermediate'].includes(tutorial.difficulty);
        return true;
      })
      .map(tutorial => ({
        ...tutorial,
        recommendationReason: 'Based on your learning path',
        recommendationScore: calculatePersonalizationScore(tutorial, userProfile, userProgress),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const getTrendingRecommendations = (tutorials) => {
    return tutorials
      .filter(tutorial => tutorial.isTrending || tutorial.recentEnrollments > 100)
      .map(tutorial => ({
        ...tutorial,
        recommendationReason: 'Trending this week',
        recommendationScore: tutorial.recentEnrollments || 0,
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const getPopularRecommendations = (tutorials) => {
    return tutorials
      .filter(tutorial => tutorial.enrolledCount > 500)
      .map(tutorial => ({
        ...tutorial,
        recommendationReason: 'Popular with learners',
        recommendationScore: tutorial.enrolledCount || 0,
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const getQuickWinRecommendations = (tutorials) => {
    return tutorials
      .filter(tutorial => tutorial.estimatedDuration <= 60) // 1 hour or less
      .map(tutorial => ({
        ...tutorial,
        recommendationReason: 'Quick to complete',
        recommendationScore: 60 - tutorial.estimatedDuration,
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const getAdvancedRecommendations = (tutorials) => {
    const userLevel = userProfile?.level || 'beginner';
    const nextLevel = userLevel === 'beginner' ? 'intermediate' : 'advanced';
    
    return tutorials
      .filter(tutorial => tutorial.difficulty === nextLevel)
      .map(tutorial => ({
        ...tutorial,
        recommendationReason: `Ready for ${nextLevel} level`,
        recommendationScore: tutorial.rating || 0,
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const getAllRecommendations = (tutorials) => {
    // Combine all recommendation types with weights
    const personalized = getPersonalizedRecommendations(tutorials).slice(0, 2);
    const trending = getTrendingRecommendations(tutorials).slice(0, 2);
    const popular = getPopularRecommendations(tutorials).slice(0, 1);
    const quick = getQuickWinRecommendations(tutorials).slice(0, 1);
    
    return [...personalized, ...trending, ...popular, ...quick]
      .filter((tutorial, index, self) => 
        index === self.findIndex(t => t.id === tutorial.id)
      ); // Remove duplicates
  };

  const calculatePersonalizationScore = (tutorial, profile, progress) => {
    let score = 0;
    
    // Language preference
    if (progress?.languages?.includes(tutorial.language)) score += 30;
    
    // Difficulty match
    const userLevel = profile?.level || 'beginner';
    if (tutorial.difficulty === userLevel) score += 25;
    
    // Category interest
    if (progress?.categories?.includes(tutorial.category)) score += 20;
    
    // Rating
    score += (tutorial.rating || 0) * 5;
    
    // Recency
    if (tutorial.isNew) score += 10;
    
    return score;
  };

  const getRecommendationIcon = (reason) => {
    if (reason.includes('learning path')) return LightBulbIcon;
    if (reason.includes('Trending')) return ArrowTrendingUpIcon;
    if (reason.includes('Popular')) return UserGroupIcon;
    if (reason.includes('Quick')) return ClockIcon;
    if (reason.includes('level')) return StarIcon;
    return SparklesIcon;
  };

  return (
    <div className={clsx('space-y-6', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Recommended for You
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Personalized tutorials based on your learning journey
          </p>
        </div>
        
        <Button variant="ghost" size="sm" onClick={generateRecommendations}>
          <SparklesIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {recommendationCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={clsx(
                'flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Recommendations grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-secondary-200 dark:bg-secondary-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((tutorial, index) => {
            const ReasonIcon = getRecommendationIcon(tutorial.recommendationReason);
            
            return (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative"
              >
                {/* Recommendation badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge 
                    variant="primary" 
                    size="sm"
                    className="shadow-lg"
                  >
                    <ReasonIcon className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
                
                <TutorialCard
                  tutorial={{
                    ...tutorial,
                    isRecommended: true,
                  }}
                  onClick={onTutorialClick}
                  animate
                />
                
                {/* Recommendation reason */}
                <motion.div
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <ReasonIcon className="w-3 h-3 mr-1" />
                  {tutorial.recommendationReason}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <SparklesIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            No recommendations available
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Complete a few tutorials to get personalized recommendations.
          </p>
          <Button variant="primary" size="sm">
            Browse All Tutorials
          </Button>
        </Card>
      )}

      {/* Recommendation insights */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-800/50 rounded-lg">
              <LightBulbIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                Why these recommendations?
              </h4>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Our AI analyzes your learning patterns, completed tutorials, and skill gaps to suggest 
                the most relevant content for your journey. The more you learn, the better our recommendations become!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RecommendationEngine;