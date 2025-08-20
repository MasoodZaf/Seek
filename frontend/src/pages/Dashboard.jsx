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
import AITutorButton from '../components/ai/AITutorButton';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTutorials, setRecentTutorials] = useState([]);
  const [achievements, setAchievements] = useState([]);
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
            progress: Math.floor(Math.random() * 100), // Mock progress
            language: String(tutorial.language || 'javascript'),
            difficulty: String(tutorial.difficulty || 'beginner'),
            lastAccessed: `${Math.floor(Math.random() * 5) + 1} days ago`,
            estimatedDuration: Number(tutorial.estimatedDuration) || 0
          }));
          setRecentTutorials(tutorials);
        }
        
        // Set mock stats
        setStats({
          totalTutorials: 15,
          completedTutorials: 8,
          totalHours: 42,
          currentStreak: 12,
          level: 4,
          xp: 3240,
          nextLevelXp: 4000,
        });
        
        setAchievements([
          {
            id: 1,
            title: 'Tutorial Master',
            description: 'Complete your first JavaScript tutorial',
            iconType: 'trophy',
            earned: true,
            earnedDate: '2024-01-15',
          },
          {
            id: 2,
            title: 'Learning Streak',
            description: 'Code for 7 days straight',
            iconType: 'fire',
            earned: true,
            earnedDate: '2024-01-20',
          },
          {
            id: 3,
            title: 'Quick Learner',
            description: 'Complete 3 lessons in one day',
            iconType: 'clock',
            earned: false,
          },
          {
            id: 4,
            title: 'Code Explorer',
            description: 'Try 5 different programming languages',
            iconType: 'book',
            earned: false,
          },
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data on error
        setRecentTutorials([]);
        setStats({
          totalTutorials: 0,
          completedTutorials: 0,
          totalHours: 0,
          currentStreak: 0,
          level: 1,
          xp: 0,
          nextLevelXp: 1000,
        });
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getStatIcon = (iconType) => {
    const iconMap = {
      book: BookOpenIcon,
      clock: ClockIcon,
      fire: FireIcon,
      trophy: TrophyIcon,
    };
    return iconMap[iconType] || BookOpenIcon;
  };

  const StatCard = ({ iconType, label, value, change, color = 'primary' }) => {
    const bgColorClass = `bg-${color}-100`;
    const textColorClass = `text-${color}-600`;
    
    return (
      <Card className="p-6" animate>
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${bgColorClass}`}>
            {(() => {
              const Icon = getStatIcon(iconType);
              return <Icon className={`h-6 w-6 ${textColorClass}`} />;
            })()}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-secondary-600">{String(label)}</p>
            <p className="text-2xl font-semibold text-secondary-900">{String(value)}</p>
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
    const getLanguageColor = (language) => {
      const colors = {
        javascript: 'bg-yellow-100 text-yellow-800',
        python: 'bg-blue-100 text-blue-800',
        typescript: 'bg-blue-100 text-blue-800',
        java: 'bg-red-100 text-red-800',
      };
      return colors[language] || 'bg-gray-100 text-gray-800';
    };

    const estimatedHours = tutorial.estimatedDuration ? Math.floor(tutorial.estimatedDuration / 60) : 0;
    const estimatedMinutes = tutorial.estimatedDuration ? tutorial.estimatedDuration % 60 : 0;

    return (
      <Card hover className="p-4 transition-all duration-200 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900 mb-2">{String(tutorial.title)}</h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(tutorial.language)}`}>
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
                <div className="flex items-center text-xs text-secondary-500">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {estimatedHours}h {estimatedMinutes}m
                </div>
              )}
            </div>
            <p className="text-xs text-secondary-500">
              Last accessed: {tutorial.lastAccessed}
            </p>
          </div>
          <div className="ml-4">
            <Button variant="primary" size="sm">
              <PlayIcon className="h-4 w-4 mr-1" />
              {tutorial.progress > 0 ? 'Continue' : 'Start'}
            </Button>
          </div>
        </div>
        
        {tutorial.progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-secondary-600 mb-1">
              <span>Progress</span>
              <span>{tutorial.progress}% complete</span>
            </div>
            <Progress 
              value={tutorial.progress} 
              size="sm" 
              showLabel={false}
            />
            <p className="text-xs text-secondary-500 mt-1">
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
  
  const AchievementBadge = ({ achievement }) => {
    // Map iconType strings to actual icon components
    const getIconComponent = (iconType) => {
      const iconMap = {
        trophy: TrophyIcon,
        fire: FireIcon,
        clock: ClockIcon,
        book: BookOpenIcon,
      };
      return iconMap[iconType] || TrophyIcon;
    };
    
    return (
      <div className={`p-4 rounded-lg border-2 ${
        achievement.earned 
          ? 'border-primary-200 bg-primary-50' 
          : 'border-secondary-200 bg-secondary-50'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            achievement.earned ? 'bg-primary-100' : 'bg-secondary-100'
          }`}>
            {(() => {
              const IconComponent = getIconComponent(achievement.iconType);
              return <IconComponent className={`h-5 w-5 ${
                achievement.earned ? 'text-primary-600' : 'text-secondary-400'
              }`} />;
            })()}
          </div>
          <div className="flex-1">
            <h4 className={`font-medium ${
              achievement.earned ? 'text-secondary-900' : 'text-secondary-500'
            }`}>
              {String(achievement.title)}
            </h4>
            <p className="text-xs text-secondary-500">
              {String(achievement.description)}
            </p>
            {achievement.earned && achievement.earnedDate && (
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
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} height="120px" />
          ))}
        </div>
        <LoadingSkeleton height="300px" />
      </div>
    );
  }
  
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
              Welcome back, {user?.firstName || 'User'}! 🎯
            </h1>
            <p className="text-primary-100 mt-2">
              Ready to continue your coding journey? You're doing great!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-primary-100 text-sm">Current Level</p>
              <p className="text-4xl font-bold">{stats?.level}</p>
              <Progress 
                value={(stats?.xp / stats?.nextLevelXp) * 100}
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
          iconType="book"
          label="Completed Tutorials"
          value={`${stats?.completedTutorials}/${stats?.totalTutorials}`}
          change={12}
        />
        <StatCard
          iconType="clock"
          label="Hours Learned"
          value={stats?.totalHours}
          change={8}
          color="success"
        />
        <StatCard
          iconType="fire"
          label="Current Streak"
          value={`${stats?.currentStreak} days`}
          change={15}
          color="warning"
        />
        <StatCard
          iconType="trophy"
          label="Total XP"
          value={stats?.xp?.toLocaleString()}
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