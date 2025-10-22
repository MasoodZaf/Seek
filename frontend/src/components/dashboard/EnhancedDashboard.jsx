import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  CodeBracketIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ChevronRightIcon,
  PlayIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { 
  Card, 
  Button, 
  Badge, 
  Progress,
  LoadingSkeleton,
  StatCard,
  HeroSection,
  Timeline,
  QuickActions,
  ProgressRing,
  AnimatedCounter,
} from '../ui';
import { useAuth } from '../../context/AuthContext';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTutorials, setRecentTutorials] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent tutorials from API
        const tutorialsResponse = await fetch('/api/v1/tutorials?limit=3', {
          credentials: 'include',
        });
        
        if (tutorialsResponse.ok) {
          const tutorialsData = await tutorialsResponse.json();
          const tutorials = tutorialsData.data.tutorials.map(tutorial => ({
            id: tutorial.id,
            title: String(tutorial.title || 'Untitled Tutorial'),
            progress: Math.floor(Math.random() * 100),
            language: String(tutorial.language || 'javascript'),
            difficulty: String(tutorial.difficulty || 'beginner'),
            lastAccessed: `${Math.floor(Math.random() * 5) + 1} days ago`,
            estimatedDuration: Number(tutorial.estimatedDuration) || 0
          }));
          setRecentTutorials(tutorials);
        }
        
        // Set enhanced stats
        setStats({
          totalTutorials: 15,
          completedTutorials: 8,
          totalHours: 42,
          currentStreak: 12,
          level: 4,
          xp: 3240,
          nextLevelXp: 4000,
          weeklyGoal: 10,
          weeklyProgress: 7,
          averageScore: 87,
        });
        
        // Set achievements
        setAchievements([
          {
            id: 1,
            title: 'Tutorial Master',
            description: 'Complete your first JavaScript tutorial',
            iconType: 'trophy',
            earned: true,
            earnedDate: '2024-01-15',
            rarity: 'common',
          },
          {
            id: 2,
            title: 'Learning Streak',
            description: 'Code for 7 days straight',
            iconType: 'fire',
            earned: true,
            earnedDate: '2024-01-20',
            rarity: 'rare',
          },
          {
            id: 3,
            title: 'Quick Learner',
            description: 'Complete 3 lessons in one day',
            iconType: 'clock',
            earned: false,
            progress: 67,
            rarity: 'epic',
          },
        ]);

        // Set recent activity
        setRecentActivity([
          {
            id: 1,
            icon: BookOpenIcon,
            title: 'Completed "JavaScript Basics"',
            description: 'Earned 150 XP',
            time: '2 hours ago',
            type: 'completion',
            color: 'success',
          },
          {
            id: 2,
            icon: CodeBracketIcon,
            title: 'Practiced in Code Playground',
            description: 'Worked on array methods',
            time: '5 hours ago',
            type: 'practice',
            color: 'primary',
          },
          {
            id: 3,
            icon: TrophyIcon,
            title: 'Achievement Unlocked',
            description: 'Learning Streak - 7 days',
            time: '1 day ago',
            type: 'achievement',
            color: 'warning',
          },
          {
            id: 4,
            icon: FireIcon,
            title: 'Streak Extended',
            description: 'Day 12 of coding',
            time: '1 day ago',
            type: 'streak',
            color: 'error',
          },
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data
        setStats({
          totalTutorials: 0,
          completedTutorials: 0,
          totalHours: 0,
          currentStreak: 0,
          level: 1,
          xp: 0,
          nextLevelXp: 1000,
          weeklyGoal: 5,
          weeklyProgress: 0,
          averageScore: 0,
        });
        setRecentTutorials([]);
        setAchievements([]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      id: 1,
      icon: CodeBracketIcon,
      label: 'Code Playground',
      description: 'Practice coding skills',
      href: '/playground',
      variant: 'primary',
      badge: 'Popular',
    },
    {
      id: 2,
      icon: BookOpenIcon,
      label: 'Continue Learning',
      description: 'Resume your tutorials',
      href: '/tutorials?filter=in-progress',
      variant: 'secondary',
    },
    {
      id: 3,
      icon: SparklesIcon,
      label: 'Recommended',
      description: 'Personalized lessons',
      href: '/tutorials?filter=recommended',
      variant: 'secondary',
      badge: 'New',
    },
    {
      id: 4,
      icon: TrophyIcon,
      label: 'Achievements',
      description: 'View your progress',
      href: '/achievements',
      variant: 'ghost',
    },
  ];
  
  if (loading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton height="200px" className="rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} height="120px" className="rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LoadingSkeleton height="400px" className="rounded-xl" />
          </div>
          <LoadingSkeleton height="400px" className="rounded-xl" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section */}
      <HeroSection
        user={user}
        stats={stats}
        title={`Welcome back, ${user?.firstName || 'User'}! 🚀`}
        subtitle="Ready to level up your coding skills? Let's make today count!"
      />
      
      {/* Enhanced Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <StatCard
          icon={BookOpenIcon}
          label="Tutorials Completed"
          value={`${stats?.completedTutorials}/${stats?.totalTutorials}`}
          change={12}
          color="primary"
          variant="gradient"
        />
        <StatCard
          icon={ClockIcon}
          label="Hours Learned"
          value={stats?.totalHours}
          change={8}
          color="success"
          variant="colored"
        />
        <StatCard
          icon={FireIcon}
          label="Current Streak"
          value={`${stats?.currentStreak} days`}
          change={15}
          color="warning"
          variant="colored"
        />
        <StatCard
          icon={ChartBarIcon}
          label="Average Score"
          value={`${stats?.averageScore}%`}
          change={5}
          color="error"
          variant="colored"
        />
      </motion.div>

      {/* Weekly Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Weekly Goal
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Complete {stats?.weeklyGoal} tutorials this week
              </p>
            </div>
            <ProgressRing
              value={stats?.weeklyProgress || 0}
              max={stats?.weeklyGoal || 10}
              size="md"
              variant="success"
              showLabel={false}
            >
              <div className="text-center">
                <div className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats?.weeklyProgress}
                </div>
                <div className="text-xs text-secondary-500">of {stats?.weeklyGoal}</div>
              </div>
            </ProgressRing>
          </div>
          
          <Progress
            value={(stats?.weeklyProgress / stats?.weeklyGoal) * 100}
            variant="success"
            size="lg"
            animated
            showLabel={false}
            className="mb-2"
          />
          
          <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400">
            <span>{stats?.weeklyGoal - stats?.weeklyProgress} tutorials remaining</span>
            <span>{Math.round((stats?.weeklyProgress / stats?.weeklyGoal) * 100)}% complete</span>
          </div>
        </Card>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning Section */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              Continue Learning
            </h2>
            <Link to="/tutorials">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <Link to={`/tutorials/${tutorial.id}`}>
                  <EnhancedTutorialCard tutorial={tutorial} />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="pt-4">
            <Link to="/tutorials">
              <Button variant="primary" size="lg" className="w-full md:w-auto">
                <RocketLaunchIcon className="mr-2 h-5 w-5" />
                Explore More Tutorials
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Sidebar with Quick Actions and Activity */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Quick Actions */}
          <Card className="p-6">
            <QuickActions actions={quickActions} />
          </Card>
          
          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            
            <Timeline items={recentActivity} />
          </Card>
          
          {/* Achievement Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                Achievements
              </h3>
              <Link to="/achievements">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {achievements.slice(0, 3).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                >
                  <EnhancedAchievementBadge achievement={achievement} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced Tutorial Card Component
const EnhancedTutorialCard = ({ tutorial }) => {
  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      python: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      java: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[language] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const estimatedHours = tutorial.estimatedDuration ? Math.floor(tutorial.estimatedDuration / 60) : 0;
  const estimatedMinutes = tutorial.estimatedDuration ? tutorial.estimatedDuration % 60 : 0;

  return (
    <Card hover className="p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3 group-hover:text-primary-600 transition-colors">
            {String(tutorial.title)}
          </h3>
          
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLanguageColor(tutorial.language)}`}>
              {tutorial.language}
            </span>
            <Badge 
              variant={tutorial.difficulty === 'beginner' ? 'success' : 
                      tutorial.difficulty === 'intermediate' ? 'warning' : 'error'} 
              size="sm"
            >
              {tutorial.difficulty}
            </Badge>
            {estimatedHours > 0 && (
              <div className="flex items-center text-xs text-secondary-500 dark:text-secondary-400">
                <ClockIcon className="h-3 w-3 mr-1" />
                {estimatedHours}h {estimatedMinutes}m
              </div>
            )}
          </div>
          
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
            Last accessed: {tutorial.lastAccessed}
          </p>
        </div>
        
        <div className="ml-6">
          <Button variant="primary" size="sm" className="group-hover:scale-105 transition-transform">
            <PlayIcon className="h-4 w-4 mr-2" />
            {tutorial.progress > 0 ? 'Continue' : 'Start'}
          </Button>
        </div>
      </div>
      
      {tutorial.progress > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            <span>Progress</span>
            <span>{tutorial.progress}% complete</span>
          </div>
          <Progress 
            value={tutorial.progress} 
            size="md" 
            showLabel={false}
            animated
            variant="primary"
          />
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">
            {tutorial.progress < 100 ? 
              `~${Math.ceil((100 - tutorial.progress) * 0.2)} hours remaining` : 
              'Completed! 🎉'
            }
          </p>
        </div>
      )}
    </Card>
  );
};

// Enhanced Achievement Badge Component
const EnhancedAchievementBadge = ({ achievement }) => {
  const getIconComponent = (iconType) => {
    const iconMap = {
      trophy: TrophyIcon,
      fire: FireIcon,
      clock: ClockIcon,
      book: BookOpenIcon,
    };
    return iconMap[iconType] || TrophyIcon;
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-secondary-300 bg-secondary-50 dark:bg-secondary-800/50',
      rare: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
      epic: 'border-purple-300 bg-purple-50 dark:bg-purple-900/20',
      legendary: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
    };
    return colors[rarity] || colors.common;
  };
  
  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
      achievement.earned 
        ? `${getRarityColor(achievement.rarity)} hover:shadow-lg` 
        : 'border-secondary-200 bg-secondary-50 dark:bg-secondary-800/30 opacity-60'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          achievement.earned ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-secondary-100 dark:bg-secondary-700'
        }`}>
          {(() => {
            const IconComponent = getIconComponent(achievement.iconType);
            return <IconComponent className={`h-5 w-5 ${
              achievement.earned ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400'
            }`} />;
          })()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className={`font-medium ${
              achievement.earned ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500'
            }`}>
              {String(achievement.title)}
            </h4>
            {achievement.rarity && achievement.earned && (
              <Badge variant="primary" size="xs">
                {achievement.rarity}
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            {String(achievement.description)}
          </p>
          
          {achievement.earned && achievement.earnedDate && (
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
              Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
            </p>
          )}
          
          {!achievement.earned && achievement.progress && (
            <div className="mt-2">
              <Progress
                value={achievement.progress}
                size="xs"
                showLabel={false}
                variant="primary"
              />
              <p className="text-xs text-secondary-500 mt-1">
                {achievement.progress}% complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;