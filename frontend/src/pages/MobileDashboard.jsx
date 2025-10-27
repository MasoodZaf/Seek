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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Hero Section with Glassmorphism */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-b-3xl overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

        <div className="relative z-10 flex items-center justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black tracking-tight">
              {getGreeting()}, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="text-indigo-100 mt-2 text-sm font-medium">
              {getMotivationalMessage()}
            </p>
          </motion.div>
          {user?.avatar ? (
            <motion.img
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              src={user.avatar}
              alt="Profile"
              className="w-14 h-14 rounded-full border-3 border-white/30 shadow-xl backdrop-blur-sm"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/30"
            >
              <span className="text-2xl font-black drop-shadow-lg">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Enhanced Today's Goal with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 border-2 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-lg">Today's Goal</h3>
              <span className="text-sm text-white/90 font-semibold bg-white/10 px-3 py-1 rounded-full">
                {todayGoal.completed}/{todayGoal.target} min
              </span>
            </div>
            <div className="relative h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-white/90 font-medium">
                {Math.max(0, todayGoal.target - todayGoal.completed)} min left
              </span>
              <div className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <FireIcon className="h-4 w-4 text-orange-300" />
                <span className="text-sm font-bold">{streak} day streak</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Quick Stats with Glassmorphism */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="relative p-5 text-center shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-3 shadow-lg">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {quickStats.totalHours}
                </div>
                <div className="text-xs font-semibold text-gray-600 mt-1">Hours Coded</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="relative p-5 text-center shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-500/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-3 shadow-lg">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {quickStats.problemsSolved}
                </div>
                <div className="text-xs font-semibold text-gray-600 mt-1">Problems Solved</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Level Progress with Glassmorphism */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="relative p-5 shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-lg drop-shadow-md">
                        {quickStats.currentLevel}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <SparklesIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">
                      Level {quickStats.currentLevel}
                    </h3>
                    <p className="text-xs text-gray-600 font-semibold">
                      {quickStats.nextLevelProgress}% to next level
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <TrophyIcon className="h-8 w-8 text-yellow-500" />
                  <div className="absolute inset-0 bg-yellow-400/20 blur-xl" />
                </div>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${quickStats.nextLevelProgress}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg"
                />
              </div>
            </div>
          </Card>
        </motion.div>
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

      {/* Enhanced Quick Actions with Glassmorphism */}
      <div className="px-4 mt-8">
        <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Quick Actions
        </h2>
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="relative p-0 overflow-hidden shadow-xl bg-white/80 backdrop-blur-xl border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
              <Link
                to="/playground"
                className="relative z-10 flex items-center p-4 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
              >
                <div className="relative mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CodeBracketIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-base">Code Playground</h3>
                  <p className="text-sm text-gray-600 font-medium">Write and run code instantly</p>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-indigo-500" />
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="relative p-0 overflow-hidden shadow-xl bg-white/80 backdrop-blur-xl border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
              <Link
                to="/tutorials"
                className="relative z-10 flex items-center p-4 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-300"
              >
                <div className="relative mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpenIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-base">Continue Learning</h3>
                  <p className="text-sm text-gray-600 font-medium">Pick up where you left off</p>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-green-500" />
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="relative p-0 overflow-hidden shadow-xl bg-white/80 backdrop-blur-xl border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
              <Link
                to="/practice"
                className="relative z-10 flex items-center p-4 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-300"
              >
                <div className="relative mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <PlayIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-base">Practice Challenges</h3>
                  <p className="text-sm text-gray-600 font-medium">Solve coding problems</p>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-orange-500" />
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="relative p-0 overflow-hidden shadow-xl bg-white/80 backdrop-blur-xl border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
              <Link
                to="/achievements"
                className="relative z-10 flex items-center p-4 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300"
              >
                <div className="relative mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrophyIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-base">Achievements</h3>
                  <p className="text-sm text-gray-600 font-medium">View your progress</p>
                </div>
                <ChevronRightIcon className="h-6 w-6 text-purple-500" />
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