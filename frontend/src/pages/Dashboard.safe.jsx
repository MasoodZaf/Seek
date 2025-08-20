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
} from '@heroicons/react/24/outline';
import { 
  Card, 
  Button, 
  Badge, 
  Progress,
  LoadingSkeleton 
} from '../components/ui';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTutorials: 15,
    completedTutorials: 8,
    totalHours: 42,
    currentStreak: 12,
    level: 4,
    xp: 3240,
    nextLevelXp: 4000,
  });
  const [recentTutorials, setRecentTutorials] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simplified mock data setup
        setRecentTutorials([
          {
            id: '1',
            title: 'JavaScript Basics',
            progress: 85,
            language: 'javascript',
            difficulty: 'beginner',
            lastAccessed: '2 hours ago',
            estimatedDuration: 120
          },
          {
            id: '2', 
            title: 'React Components',
            progress: 60,
            language: 'javascript',
            difficulty: 'intermediate',
            lastAccessed: '1 day ago',
            estimatedDuration: 180
          }
        ]);
        
        setAchievements([
          {
            id: '1',
            title: 'Tutorial Master',
            description: 'Complete your first JavaScript tutorial',
            earned: true,
            earnedDate: '2024-01-15',
          },
          {
            id: '2',
            title: 'Learning Streak',
            description: 'Code for 7 days straight',
            earned: true,
            earnedDate: '2024-01-20',
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const StatCard = ({ icon: Icon, label, value, change, color = 'primary' }) => {
    const safeValue = String(value || '0');
    const safeLabel = String(label || 'Stat');
    
    return (
      <Card className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-secondary-600">{safeLabel}</p>
            <p className="text-2xl font-semibold text-secondary-900">{safeValue}</p>
            {change && (
              <p className={`text-sm ${
                change > 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  };
  
  const TutorialCard = ({ tutorial }) => {
    const safeTitle = String(tutorial?.title || 'Untitled');
    const safeLanguage = String(tutorial?.language || 'javascript');
    const safeDifficulty = String(tutorial?.difficulty || 'beginner');
    const safeProgress = Number(tutorial?.progress) || 0;
    const safeLastAccessed = String(tutorial?.lastAccessed || 'Unknown');
    
    const getLanguageColor = (language) => {
      const colors = {
        javascript: 'bg-yellow-100 text-yellow-800',
        python: 'bg-blue-100 text-blue-800',
        typescript: 'bg-blue-100 text-blue-800',
        java: 'bg-red-100 text-red-800',
      };
      return colors[language] || 'bg-gray-100 text-gray-800';
    };

    return (
      <Card hover className="p-4 transition-all duration-200 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900 mb-2">{safeTitle}</h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(safeLanguage)}`}>
                {safeLanguage}
              </span>
              <Badge 
                variant={safeDifficulty === 'beginner' ? 'success' : 
                        safeDifficulty === 'intermediate' ? 'warning' : 'error'} 
                size="sm"
              >
                {safeDifficulty}
              </Badge>
            </div>
            <p className="text-xs text-secondary-500">
              Last accessed: {safeLastAccessed}
            </p>
          </div>
          <div className="ml-4">
            <Button variant="primary" size="sm">
              <PlayIcon className="h-4 w-4 mr-1" />
              {safeProgress > 0 ? 'Continue' : 'Start'}
            </Button>
          </div>
        </div>
        
        {safeProgress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-secondary-600 mb-1">
              <span>Progress</span>
              <span>{safeProgress}% complete</span>
            </div>
            <Progress 
              value={safeProgress} 
              size="sm" 
              showLabel={false}
            />
          </div>
        )}
      </Card>
    );
  };
  
  const AchievementBadge = ({ achievement }) => {
    const safeTitle = String(achievement?.title || 'Achievement');
    const safeDescription = String(achievement?.description || 'Description');
    const isEarned = Boolean(achievement?.earned);
    
    return (
      <div className={`p-4 rounded-lg border-2 ${
        isEarned 
          ? 'border-primary-200 bg-primary-50' 
          : 'border-secondary-200 bg-secondary-50'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isEarned ? 'bg-primary-100' : 'bg-secondary-100'
          }`}>
            <TrophyIcon className={`h-5 w-5 ${
              isEarned ? 'text-primary-600' : 'text-secondary-400'
            }`} />
          </div>
          <div className="flex-1">
            <h4 className={`font-medium ${
              isEarned ? 'text-secondary-900' : 'text-secondary-500'
            }`}>
              {safeTitle}
            </h4>
            <p className="text-xs text-secondary-500">
              {safeDescription}
            </p>
            {isEarned && achievement?.earnedDate && (
              <p className="text-xs text-primary-600 mt-1">
                Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} height="120px" />
          ))}
        </div>
        <LoadingSkeleton height="300px" />
      </div>
    );
  }
  
  const userName = user?.firstName || 'User';
  const userLevel = stats?.level || 1;
  const userXP = stats?.xp || 0;
  const nextLevelXP = stats?.nextLevelXp || 1000;
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {userName}! 🎯
            </h1>
            <p className="text-primary-100 mt-2">
              Ready to continue your coding journey? You're doing great!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-primary-100 text-sm">Current Level</p>
              <p className="text-4xl font-bold">{userLevel}</p>
              <Progress 
                value={(userXP / nextLevelXP) * 100}
                size="sm"
                variant="success"
                className="mt-2 w-32"
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpenIcon}
          label="Completed Tutorials"
          value={`${stats.completedTutorials}/${stats.totalTutorials}`}
          change={12}
        />
        <StatCard
          icon={ClockIcon}
          label="Hours Learned"
          value={stats.totalHours}
          change={8}
          color="success"
        />
        <StatCard
          icon={FireIcon}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          change={15}
          color="warning"
        />
        <StatCard
          icon={TrophyIcon}
          label="Total XP"
          value={stats.xp?.toLocaleString()}
          change={22}
          color="error"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tutorials */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
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
            {recentTutorials.map((tutorial) => (
              <Link key={tutorial.id} to={`/tutorials/${tutorial.id}`}>
                <TutorialCard tutorial={tutorial} />
              </Link>
            ))}
          </div>
          
          <div className="mt-6">
            <Link to="/tutorials">
              <Button variant="primary" size="lg">
                <BookOpenIcon className="mr-2 h-5 w-5" />
                Explore More Tutorials
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Achievements & Quick Actions */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to="/playground">
                <Button variant="primary" size="sm" className="w-full justify-start">
                  <CodeBracketIcon className="mr-2 h-4 w-4" />
                  Code Playground
                </Button>
              </Link>
              <Link to="/tutorials?filter=recommended">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  <BookOpenIcon className="mr-2 h-4 w-4" />
                  Recommended Lessons
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Practice Exercises
                </Button>
              </Link>
              <Link to="/progress">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <TrophyIcon className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </Link>
            </div>
          </Card>
          
          {/* Recent Achievements */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-secondary-900">
                Achievements
              </h3>
              <Link to="/achievements">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <AchievementBadge 
                  key={achievement.id} 
                  achievement={achievement} 
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;