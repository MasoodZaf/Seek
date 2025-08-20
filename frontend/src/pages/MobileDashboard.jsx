import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FireIcon,
  BoltIcon,
  TrophyIcon,
  BookOpenIcon,
  CodeBracketIcon,
  PlayIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge, Progress } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const MobileDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [todayGoal, setTodayGoal] = useState({ target: 30, completed: 15 }); // minutes
  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: false },
    { day: 'Fri', completed: false },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false }
  ]);
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'lesson',
      title: 'JavaScript Arrays',
      progress: 85,
      timeAgo: '2 hours ago',
      language: 'javascript'
    },
    {
      id: 2,
      type: 'exercise',
      title: 'Binary Search Challenge',
      completed: true,
      timeAgo: '1 day ago',
      language: 'python'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'First Code Review',
      timeAgo: '2 days ago'
    }
  ]);
  const [quickStats, setQuickStats] = useState({
    totalHours: 42,
    problemsSolved: 127,
    currentLevel: 4,
    nextLevelProgress: 65
  });

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load user data
    if (user) {
      setStreak(user.progress?.currentStreak || 0);
    }
  }, [user]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Let's code something amazing today! 🚀",
      "Every line of code brings you closer to mastery 💪",
      "Your consistency is building incredible skills! 🌟",
      "Ready to tackle today's coding challenge? ⚡",
      "Transform your ideas into code today! 💡"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const progressPercentage = (todayGoal.completed / todayGoal.target) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="text-primary-100 mt-1">
              {getMotivationalMessage()}
            </p>
          </div>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Today's Goal */}
        <Card className="bg-white bg-opacity-10 backdrop-blur border-white border-opacity-20 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Today's Goal</h3>
            <span className="text-sm text-primary-100">
              {todayGoal.completed}/{todayGoal.target} min
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-3 bg-white bg-opacity-20"
            indicatorClassName="bg-white"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-primary-100">
              {Math.max(0, todayGoal.target - todayGoal.completed)} min left
            </span>
            <div className="flex items-center space-x-1">
              <FireIcon className="h-4 w-4 text-orange-300" />
              <span className="text-sm font-semibold">{streak} day streak</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-4 text-center shadow-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-full mx-auto mb-2">
                <ClockIcon className="h-5 w-5 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900">
                {quickStats.totalHours}
              </div>
              <div className="text-xs text-secondary-500">Hours coded</div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-4 text-center shadow-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-warning-100 rounded-full mx-auto mb-2">
                <BoltIcon className="h-5 w-5 text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900">
                {quickStats.problemsSolved}
              </div>
              <div className="text-xs text-secondary-500">Problems solved</div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="px-4 mt-4">
        <Card className="p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {quickStats.currentLevel}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">
                  Level {quickStats.currentLevel}
                </h3>
                <p className="text-xs text-secondary-500">
                  {quickStats.nextLevelProgress}% to next level
                </p>
              </div>
            </div>
            <TrophyIcon className="h-6 w-6 text-warning-500" />
          </div>
          <Progress
            value={quickStats.nextLevelProgress}
            className="h-2"
          />
        </Card>
      </div>

      {/* Weekly Progress */}
      <div className="px-4 mt-4">
        <Card className="p-4 shadow-lg">
          <h3 className="font-semibold text-secondary-900 mb-3 flex items-center">
            <CalendarDaysIcon className="h-5 w-5 mr-2" />
            This Week
          </h3>
          <div className="flex justify-between">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="text-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-medium
                    ${day.completed
                      ? 'bg-success-500 text-white'
                      : 'bg-secondary-100 text-secondary-400'
                    }
                  `}
                >
                  {index === new Date().getDay() ? '📅' : '●'}
                </div>
                <span className="text-xs text-secondary-500">{day.day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-0 overflow-hidden shadow-lg">
              <Link
                to="/playground"
                className="flex items-center p-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <CodeBracketIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">Code Playground</h3>
                  <p className="text-sm text-secondary-500">Write and run code instantly</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-secondary-400" />
              </Link>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-0 overflow-hidden shadow-lg">
              <Link
                to="/tutorials"
                className="flex items-center p-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-success-600 to-success-500 rounded-xl flex items-center justify-center mr-4">
                  <BookOpenIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">Continue Learning</h3>
                  <p className="text-sm text-secondary-500">Pick up where you left off</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-secondary-400" />
              </Link>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-0 overflow-hidden shadow-lg">
              <Link
                to="/practice"
                className="flex items-center p-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-warning-600 to-warning-500 rounded-xl flex items-center justify-center mr-4">
                  <PlayIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">Practice Challenges</h3>
                  <p className="text-sm text-secondary-500">Solve coding problems</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-secondary-400" />
              </Link>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-0 overflow-hidden shadow-lg">
              <Link
                to="/achievements"
                className="flex items-center p-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <TrophyIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">Achievements</h3>
                  <p className="text-sm text-secondary-500">View your progress</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-secondary-400" />
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-6 pb-24">
        <h2 className="text-lg font-bold text-secondary-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${activity.type === 'lesson' ? 'bg-primary-100' :
                      activity.type === 'exercise' ? 'bg-success-100' :
                      'bg-warning-100'
                    }
                  `}>
                    {activity.type === 'lesson' && (
                      <BookOpenIcon className="h-5 w-5 text-primary-600" />
                    )}
                    {activity.type === 'exercise' && (
                      <PlayIcon className="h-5 w-5 text-success-600" />
                    )}
                    {activity.type === 'achievement' && (
                      <TrophyIcon className="h-5 w-5 text-warning-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-secondary-500">
                        {activity.timeAgo}
                      </span>
                      {activity.language && (
                        <Badge variant="secondary" size="sm">
                          {activity.language}
                        </Badge>
                      )}
                    </div>
                    
                    {activity.progress && (
                      <div className="mt-2">
                        <Progress
                          value={activity.progress}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  {activity.completed && (
                    <div className="text-success-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;