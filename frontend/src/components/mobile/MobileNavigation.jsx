import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  PlayIcon,
  CodeBracketIcon,
  TrophyIcon,
  UserCircleIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  BookOpenIcon as BookSolid,
  PlayIcon as PlaySolid,
  CodeBracketIcon as CodeSolid,
  TrophyIcon as TrophySolid,
  UserCircleIcon as UserSolid,
  SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';
import { Badge } from '../ui';
import { useAuth } from '../../context/AuthContext';
import AITutorButton from '../ai/AITutorButton';

const MobileNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  // Icon mapping functions to avoid storing React components in objects
  const getNavigationIcon = (iconType, isActive = false) => {
    const iconMap = {
      home: { icon: HomeIcon, active: HomeSolid },
      book: { icon: BookOpenIcon, active: BookSolid },
      code: { icon: CodeBracketIcon, active: CodeSolid },
      play: { icon: PlayIcon, active: PlaySolid },
      trophy: { icon: TrophyIcon, active: TrophySolid }
    };
    const icons = iconMap[iconType] || iconMap.home;
    return isActive ? icons.active : icons.icon;
  };

  const navigationItems = [
    {
      path: '/',
      label: 'Home',
      iconType: 'home',
      color: 'text-primary-600'
    },
    {
      path: '/tutorials',
      label: 'Learn',
      iconType: 'book',
      color: 'text-success-600'
    },
    {
      path: '/playground',
      label: 'Code',
      iconType: 'code',
      color: 'text-purple-600'
    },
    {
      path: '/practice',
      label: 'Practice',
      iconType: 'play',
      color: 'text-orange-600'
    },
    {
      path: '/achievements',
      label: 'Progress',
      iconType: 'trophy',
      color: 'text-yellow-600',
      badge: hasNewNotifications ? '!' : null
    }
  ];

  const getMenuIcon = (iconType) => {
    const iconMap = {
      profile: UserCircleIcon,
      settings: Bars3Icon,
      help: SparklesIcon
    };
    return iconMap[iconType] || UserCircleIcon;
  };

  const menuItems = [
    { path: '/profile', label: 'Profile', iconType: 'profile' },
    { path: '/settings', label: 'Settings', iconType: 'settings' },
    { path: '/help', label: 'Help & Support', iconType: 'help' }
  ];

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Hide body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 z-40 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => {
            const Icon = getNavigationIcon(item.iconType, isActive(item.path));
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center space-y-1 py-1
                  ${active ? item.color : 'text-secondary-400'}
                  hover:bg-secondary-50 transition-colors relative
                `}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 bg-white border-b border-secondary-200 z-30 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-semibold text-secondary-900">Seek</h1>
              {user && (
                <p className="text-xs text-secondary-500">
                  Welcome, {user.firstName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="relative p-2 text-secondary-600 hover:text-secondary-900">
              <SparklesIcon className="h-6 w-6" />
              {hasNewNotifications && (
                <div className="absolute top-1 right-1 h-2 w-2 bg-error-500 rounded-full" />
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-secondary-600 hover:text-secondary-900"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                <div className="flex items-center space-x-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-secondary-900">
                      {user?.fullName || 'Guest User'}
                    </h2>
                    <p className="text-sm text-secondary-500">
                      Level {user?.progress?.level || 1}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-secondary-400 hover:text-secondary-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* User Stats */}
              {user && (
                <div className="p-6 bg-gradient-to-r from-primary-50 to-purple-50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {user.progress?.totalPoints || 0}
                      </div>
                      <div className="text-xs text-secondary-600">Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success-600">
                        {user.progress?.currentStreak || 0}
                      </div>
                      <div className="text-xs text-secondary-600">Day Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning-600">
                        {user.progress?.completedExercises || 0}
                      </div>
                      <div className="text-xs text-secondary-600">Completed</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="p-6 space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    {(() => {
                      const IconComponent = getMenuIcon(item.iconType);
                      return <IconComponent className="h-6 w-6 text-secondary-400" />;
                    })()}
                    <span className="font-medium text-secondary-700">
                      {item.label}
                    </span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-secondary-200">
                  <AITutorButton
                    variant="inline"
                    className="w-full justify-start"
                    context={{ type: 'general', page: 'mobile-menu' }}
                  >
                    Ask AI Tutor
                  </AITutorButton>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-secondary-200 bg-secondary-50">
                <div className="text-center">
                  <p className="text-sm text-secondary-600">
                    Seek Learning Platform
                  </p>
                  <p className="text-xs text-secondary-400 mt-1">
                    Version 1.0.0
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default MobileNavigation;