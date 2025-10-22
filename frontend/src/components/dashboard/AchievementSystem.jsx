import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  ClockIcon,
  HeartIcon,
  BoltIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  Button,
  Input,
  Select,
  AchievementBadge,
  AchievementUnlock,
  Progress,
} from '../ui';

const AchievementSystem = ({ userAchievements = [], className, ...props }) => {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  // Mock achievements data
  useEffect(() => {
    const mockAchievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first tutorial',
        iconType: 'star',
        category: 'learning',
        rarity: 'common',
        earned: true,
        earnedDate: '2024-01-15',
        rewards: ['50 XP', 'Beginner Badge'],
        progress: 100,
      },
      {
        id: 2,
        title: 'Code Warrior',
        description: 'Write 1000 lines of code',
        iconType: 'bolt',
        category: 'coding',
        rarity: 'rare',
        earned: true,
        earnedDate: '2024-01-20',
        rewards: ['200 XP', 'Warrior Badge', 'Special Theme'],
        progress: 100,
      },
      {
        id: 3,
        title: 'Learning Streak',
        description: 'Code for 30 days straight',
        iconType: 'fire',
        category: 'consistency',
        rarity: 'epic',
        earned: false,
        progress: 67,
        rewards: ['500 XP', 'Streak Master Badge', 'Fire Theme'],
      },
      {
        id: 4,
        title: 'JavaScript Master',
        description: 'Complete all JavaScript tutorials',
        iconType: 'trophy',
        category: 'mastery',
        rarity: 'legendary',
        earned: false,
        progress: 45,
        rewards: ['1000 XP', 'Master Certificate', 'Golden Badge', 'Exclusive Avatar'],
      },
      {
        id: 5,
        title: 'Speed Demon',
        description: 'Complete a tutorial in under 30 minutes',
        iconType: 'rocket',
        category: 'speed',
        rarity: 'rare',
        earned: true,
        earnedDate: '2024-01-25',
        rewards: ['150 XP', 'Speed Badge'],
        progress: 100,
      },
      {
        id: 6,
        title: 'Helper',
        description: 'Help 10 other learners in the community',
        iconType: 'heart',
        category: 'community',
        rarity: 'epic',
        earned: false,
        progress: 30,
        rewards: ['300 XP', 'Helper Badge', 'Community Recognition'],
      },
      {
        id: 7,
        title: 'Night Owl',
        description: 'Code between 10 PM and 6 AM for 7 days',
        iconType: 'clock',
        category: 'special',
        rarity: 'rare',
        earned: false,
        progress: 85,
        rewards: ['200 XP', 'Night Owl Badge', 'Dark Theme'],
      },
      {
        id: 8,
        title: 'Perfectionist',
        description: 'Score 100% on 5 quizzes in a row',
        iconType: 'sparkles',
        category: 'accuracy',
        rarity: 'epic',
        earned: false,
        progress: 60,
        rewards: ['400 XP', 'Perfect Badge', 'Golden Star'],
      },
    ];

    setAchievements(mockAchievements);
    setFilteredAchievements(mockAchievements);
  }, []);

  // Filter achievements
  useEffect(() => {
    let filtered = achievements;

    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(achievement => achievement.category === selectedCategory);
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(achievement => achievement.rarity === selectedRarity);
    }

    setFilteredAchievements(filtered);
  }, [achievements, searchTerm, selectedCategory, selectedRarity]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'learning', label: 'Learning' },
    { value: 'coding', label: 'Coding' },
    { value: 'consistency', label: 'Consistency' },
    { value: 'mastery', label: 'Mastery' },
    { value: 'speed', label: 'Speed' },
    { value: 'community', label: 'Community' },
    { value: 'special', label: 'Special' },
    { value: 'accuracy', label: 'Accuracy' },
  ];

  const rarities = [
    { value: 'all', label: 'All Rarities' },
    { value: 'common', label: 'Common' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const handleAchievementClick = (achievement) => {
    if (achievement.earned) {
      setUnlockedAchievement(achievement);
      setShowUnlockModal(true);
    }
  };

  const handleShare = (achievement) => {
    // Mock share functionality
    const shareText = `I just unlocked the "${achievement.title}" achievement on Seek! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Unlocked!',
        text: shareText,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      // You could show a toast notification here
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const completionPercentage = (earnedCount / totalCount) * 100;

  const rarityStats = {
    common: achievements.filter(a => a.rarity === 'common' && a.earned).length,
    rare: achievements.filter(a => a.rarity === 'rare' && a.earned).length,
    epic: achievements.filter(a => a.rarity === 'epic' && a.earned).length,
    legendary: achievements.filter(a => a.rarity === 'legendary' && a.earned).length,
  };

  return (
    <div className={className} {...props}>
      <div className="space-y-8">
        {/* Achievement Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              Achievements
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {earnedCount}/{totalCount}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Unlocked
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(completionPercentage)}% Complete</span>
            </div>
            <Progress
              value={completionPercentage}
              size="lg"
              variant="gradient"
              animated
              showLabel={false}
            />
          </div>

          {/* Rarity breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <div className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                {rarityStats.common}
              </div>
              <div className="text-xs text-secondary-500">Common</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {rarityStats.rare}
              </div>
              <div className="text-xs text-blue-500">Rare</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {rarityStats.epic}
              </div>
              <div className="text-xs text-purple-500">Epic</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {rarityStats.legendary}
              </div>
              <div className="text-xs text-yellow-500">Legendary</div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={MagnifyingGlassIcon}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories}
                className="min-w-[150px]"
              />
              <Select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                options={rarities}
                className="min-w-[120px]"
              />
            </div>
          </div>
        </Card>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <AchievementBadge
                achievement={achievement}
                size="md"
                variant="card"
                onClick={handleAchievementClick}
                onShare={handleShare}
                showProgress
                showActions
                animate
              />
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {filteredAchievements.length === 0 && (
          <Card className="p-12 text-center">
            <TrophyIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              No achievements found
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Try adjusting your search or filter criteria.
            </p>
          </Card>
        )}
      </div>

      {/* Achievement unlock modal */}
      <AchievementUnlock
        isVisible={showUnlockModal}
        achievement={unlockedAchievement}
        onClose={() => setShowUnlockModal(false)}
        onShare={handleShare}
      />
    </div>
  );
};

export default AchievementSystem;