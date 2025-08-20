import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  LockClosedIcon,
  CalendarIcon,
  ChartBarIcon,
  GiftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Card, Badge, Progress, Loading } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useInView } from 'react-intersection-observer';

const Achievements = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState(new Set());
  const [stats, setStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Icon mapping function to prevent object rendering
  const getCategoryIconComponent = (iconType) => {
    const iconMap = {
      trophy: TrophyIcon,
      rocket: RocketLaunchIcon,
      chart: ChartBarIcon,
      bulb: LightBulbIcon,
      sparkles: SparklesIcon,
      academic: AcademicCapIcon,
    };
    return iconMap[iconType] || TrophyIcon;
  };
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Mock achievements data
  const mockAchievements = [
    // Beginner Achievements
    {
      id: 1,
      name: "First Steps",
      description: "Execute your first piece of code",
      category: "beginner",
      icon: "🚀",
      points: 10,
      rarity: "common",
      requirement: "Execute 1 code snippet",
      progress: 1,
      maxProgress: 1,
      earned: true,
      earnedAt: new Date('2024-01-15T10:30:00Z'),
      tier: 1
    },
    {
      id: 2,
      name: "Hello World Master",
      description: "Write your first Hello World program in all supported languages",
      category: "beginner",
      icon: "👋",
      points: 25,
      rarity: "uncommon",
      requirement: "Hello World in JS, Python, TypeScript, and Java",
      progress: 2,
      maxProgress: 4,
      earned: false,
      tier: 1
    },
    {
      id: 3,
      name: "Code Explorer",
      description: "Execute code in 3 different programming languages",
      category: "beginner",
      icon: "🌍",
      points: 30,
      rarity: "uncommon",
      requirement: "Use 3 different languages",
      progress: 2,
      maxProgress: 3,
      earned: false,
      tier: 2
    },
    
    // Progress Achievements
    {
      id: 4,
      name: "Century Club",
      description: "Execute 100 code snippets",
      category: "progress",
      icon: "💯",
      points: 50,
      rarity: "rare",
      requirement: "Execute 100 code snippets",
      progress: 42,
      maxProgress: 100,
      earned: false,
      tier: 2
    },
    {
      id: 5,
      name: "Code Warrior",
      description: "Execute 50 code snippets successfully",
      category: "progress",
      icon: "⚔️",
      points: 40,
      rarity: "uncommon",
      requirement: "50 successful executions",
      progress: 50,
      maxProgress: 50,
      earned: true,
      earnedAt: new Date('2024-01-20T15:45:00Z'),
      tier: 2
    },
    {
      id: 6,
      name: "Marathon Runner",
      description: "Code for 7 consecutive days",
      category: "progress",
      icon: "🏃‍♂️",
      points: 75,
      rarity: "rare",
      requirement: "7 day coding streak",
      progress: 3,
      maxProgress: 7,
      earned: false,
      tier: 3
    },
    
    // Skill Achievements
    {
      id: 7,
      name: "Bug Hunter",
      description: "Successfully debug and fix 10 code errors",
      category: "skill",
      icon: "🐛",
      points: 60,
      rarity: "rare",
      requirement: "Fix 10 code errors",
      progress: 7,
      maxProgress: 10,
      earned: false,
      tier: 2
    },
    {
      id: 8,
      name: "Algorithm Ace",
      description: "Solve 25 algorithmic challenges",
      category: "skill",
      icon: "🧠",
      points: 100,
      rarity: "epic",
      requirement: "Complete 25 algorithm challenges",
      progress: 8,
      maxProgress: 25,
      earned: false,
      tier: 3
    },
    {
      id: 9,
      name: "Speed Demon",
      description: "Solve 5 challenges in under 2 minutes each",
      category: "skill",
      icon: "⚡",
      points: 80,
      rarity: "rare",
      requirement: "5 challenges under 2 minutes",
      progress: 2,
      maxProgress: 5,
      earned: false,
      tier: 3
    },
    
    // Special Achievements
    {
      id: 10,
      name: "Night Owl",
      description: "Code between 12 AM and 6 AM for 5 different days",
      category: "special",
      icon: "🦉",
      points: 45,
      rarity: "uncommon",
      requirement: "Code during night hours 5 times",
      progress: 1,
      maxProgress: 5,
      earned: false,
      tier: 2
    },
    {
      id: 11,
      name: "Early Bird",
      description: "Code between 5 AM and 8 AM for 7 different days",
      category: "special",
      icon: "🐦",
      points: 55,
      rarity: "rare",
      requirement: "Code during early morning 7 times",
      progress: 0,
      maxProgress: 7,
      earned: false,
      tier: 2
    },
    {
      id: 12,
      name: "Code Perfectionist",
      description: "Write code with zero syntax errors 20 times in a row",
      category: "special",
      icon: "✨",
      points: 90,
      rarity: "epic",
      requirement: "20 consecutive error-free executions",
      progress: 0,
      maxProgress: 20,
      earned: false,
      tier: 4
    },
    
    // Community Achievements
    {
      id: 13,
      name: "Helper",
      description: "Share your code with the community 5 times",
      category: "community",
      icon: "🤝",
      points: 35,
      rarity: "common",
      requirement: "Share 5 code snippets",
      progress: 0,
      maxProgress: 5,
      earned: false,
      tier: 1
    },
    {
      id: 14,
      name: "Mentor",
      description: "Help 10 other users with their coding problems",
      category: "community",
      icon: "👨‍🏫",
      points: 120,
      rarity: "legendary",
      requirement: "Help 10 users",
      progress: 0,
      maxProgress: 10,
      earned: false,
      tier: 4
    }
  ];

  const categories = [
    { id: 'all', name: 'All Achievements', iconType: 'trophy' },
    { id: 'beginner', name: 'Beginner', iconType: 'rocket' },
    { id: 'progress', name: 'Progress', iconType: 'chart' },
    { id: 'skill', name: 'Skill', iconType: 'bulb' },
    { id: 'special', name: 'Special', iconType: 'sparkles' },
    { id: 'community', name: 'Community', iconType: 'academic' }
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const tierColors = {
    1: 'bg-bronze-100 border-bronze-300',
    2: 'bg-silver-100 border-silver-300',
    3: 'bg-gold-100 border-gold-300',
    4: 'bg-platinum-100 border-platinum-300'
  };

  useEffect(() => {
    loadAchievements();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAchievements = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAchievements(mockAchievements);
      
      // Load user's earned achievements
      const earned = mockAchievements
        .filter(a => a.earned)
        .map(a => a.id);
      setUserAchievements(new Set(earned));
      
      // Calculate stats
      const totalPoints = mockAchievements
        .filter(a => a.earned)
        .reduce((sum, a) => sum + a.points, 0);
      
      const earnedCount = earned.length;
      const totalCount = mockAchievements.length;
      const completionRate = Math.round((earnedCount / totalCount) * 100);
      
      setStats({
        totalPoints,
        earnedCount,
        totalCount,
        completionRate,
        rank: calculateRank(totalPoints),
        nextRankPoints: getNextRankPoints(totalPoints)
      });
      
    } catch (error) {
      // Error loading achievements
    } finally {
      setLoading(false);
    }
  };

  const calculateRank = (points) => {
    if (points >= 1000) return 'Legendary Coder';
    if (points >= 500) return 'Expert Developer';
    if (points >= 250) return 'Senior Programmer';
    if (points >= 100) return 'Junior Developer';
    if (points >= 50) return 'Coding Enthusiast';
    return 'Beginner';
  };

  const getNextRankPoints = (points) => {
    if (points < 50) return 50 - points;
    if (points < 100) return 100 - points;
    if (points < 250) return 250 - points;
    if (points < 500) return 500 - points;
    if (points < 1000) return 1000 - points;
    return 0;
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const AchievementCard = ({ achievement, index }) => {
    const [ref, inView] = useInView({ threshold: 0.1 });
    const isEarned = userAchievements.has(achievement.id);
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onClick={() => setSelectedAchievement(achievement)}
        className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
          isEarned 
            ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' 
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Rarity gradient overlay */}
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${rarityColors[achievement.rarity]}`} />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`text-3xl ${!isEarned && 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div>
                <h3 className={`font-bold ${isEarned ? 'text-yellow-800' : 'text-gray-700'}`}>
                  {achievement.name}
                </h3>
                <Badge 
                  variant={achievement.rarity === 'legendary' ? 'warning' : 
                          achievement.rarity === 'epic' ? 'primary' :
                          achievement.rarity === 'rare' ? 'info' : 'secondary'}
                  size="sm"
                >
                  {achievement.rarity}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              {isEarned ? (
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              ) : (
                <LockClosedIcon className="w-8 h-8 text-gray-400" />
              )}
              <div className="text-sm font-medium text-gray-600 mt-1">
                {achievement.points} pts
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className={`text-sm mb-4 ${isEarned ? 'text-yellow-700' : 'text-gray-600'}`}>
            {achievement.description}
          </p>
          
          {/* Progress */}
          {!isEarned && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
          
          {/* Earned date */}
          {isEarned && achievement.earnedAt && (
            <div className="flex items-center text-xs text-yellow-600">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Earned {achievement.earnedAt.toLocaleDateString()}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return <Loading text="Loading your achievements..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
                <TrophyIcon className="w-8 h-8 mr-3 text-yellow-500" />
                Achievements
              </h1>
              <p className="text-secondary-600">
                Track your coding milestones and unlock rewards
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.totalPoints}
              </div>
              <div className="text-sm text-secondary-600">Total Points</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">{stats.earnedCount}</div>
              <div className="text-sm text-green-700">Earned</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ChartBarIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <StarIcon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-lg font-bold text-purple-600">{stats.rank}</div>
              <div className="text-sm text-purple-700">Current Rank</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FireIcon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-600">{stats.nextRankPoints}</div>
              <div className="text-sm text-orange-700">To Next Rank</div>
            </div>
          </div>
        </Card>
        
        {/* Recent Achievement */}
        <Card className="p-6">
          <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
            <GiftIcon className="w-5 h-5 mr-2 text-primary-600" />
            Latest Achievement
          </h3>
          
          {(() => {
            const latest = achievements
              .filter(a => a.earned && a.earnedAt)
              .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))[0];
            
            return latest ? (
              <div className="text-center">
                <div className="text-3xl mb-2">{latest.icon}</div>
                <div className="font-medium text-secondary-900">{latest.name}</div>
                <div className="text-xs text-secondary-600 mt-1">
                  {latest.earnedAt.toLocaleDateString()}
                </div>
                <Badge variant="warning" size="sm" className="mt-2">
                  +{latest.points} points
                </Badge>
              </div>
            ) : (
              <div className="text-center text-secondary-500">
                <LockClosedIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No achievements yet</p>
                <p className="text-xs">Start coding to earn your first!</p>
              </div>
            );
          })()}
        </Card>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                : 'bg-white text-secondary-600 border-2 border-secondary-200 hover:border-secondary-300'
            }`}
          >
            {(() => {
              const IconComponent = getCategoryIconComponent(category.iconType);
              return <IconComponent className="w-5 h-5 mr-2" />;
            })()}
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
            index={index}
          />
        ))}
      </div>
      
      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {selectedAchievement.name}
                </h3>
                <Badge 
                  variant={selectedAchievement.rarity === 'legendary' ? 'warning' : 
                          selectedAchievement.rarity === 'epic' ? 'primary' :
                          selectedAchievement.rarity === 'rare' ? 'info' : 'secondary'}
                  className="mb-4"
                >
                  {selectedAchievement.rarity} • {selectedAchievement.points} points
                </Badge>
                
                <p className="text-secondary-700 mb-4">
                  {selectedAchievement.description}
                </p>
                
                <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-secondary-900 mb-2">Requirements:</h4>
                  <p className="text-sm text-secondary-600">{selectedAchievement.requirement}</p>
                </div>
                
                {!userAchievements.has(selectedAchievement.id) && (
                  <div>
                    <div className="flex justify-between text-sm text-secondary-600 mb-2">
                      <span>Progress</span>
                      <span>
                        {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                      </span>
                    </div>
                    <Progress 
                      value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100} 
                      className="mb-4" 
                    />
                  </div>
                )}
                
                {userAchievements.has(selectedAchievement.id) && selectedAchievement.earnedAt && (
                  <div className="flex items-center justify-center text-green-600 mb-4">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                      Earned on {selectedAchievement.earnedAt.toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;