import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  PlayIcon,
  CodeBracketIcon,
  TrophyIcon,
  UserCircleIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  FireIcon,
  StarIcon,
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
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const dragControls = useDragControls();
  const menuRef = useRef(null);

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
      path: '/dashboard',
      label: 'Home',
      iconType: 'home',
      color: 'text-primary-600',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      path: '/tutorials',
      label: 'Learn',
      iconType: 'book',
      color: 'text-success-600',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      path: '/playground',
      label: 'Code',
      iconType: 'code',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      path: '/practice',
      label: 'Practice',
      iconType: 'play',
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      path: '/achievements',
      label: 'Progress',
      iconType: 'trophy',
      color: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-600',
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
    setShowQuickActions(false);
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

  // Handle swipe gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldClose = info.velocity.x > 500 || info.offset.x > 150;
    if (shouldClose) {
      setIsMenuOpen(false);
    }
  };

  // Handle double tap for quick actions
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      setShowQuickActions(!showQuickActions);
    }
    setLastTap(now);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Enhanced Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-secondary-200/50 z-40 md:hidden shadow-2xl">
        {/* Quick Actions Bar */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-secondary-200/50 px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50"
            >
              <div className="flex items-center justify-around">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-white/50"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-primary-600" />
                  <span className="text-xs text-primary-600 font-medium">Search</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-white/50"
                >
                  <BellIcon className="h-5 w-5 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">Alerts</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-white/50"
                >
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">AI Help</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item, index) => {
            const Icon = getNavigationIcon(item.iconType, isActive(item.path));
            const active = isActive(item.path);
            
            return (
              <motion.div
                key={item.path}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onTouchStart={handleDoubleTap}
                  className={`
                    flex flex-col items-center justify-center space-y-1 py-2 h-full
                    ${active ? item.color : 'text-secondary-400'}
                    active:bg-secondary-100 transition-all duration-200 relative
                    touch-manipulation select-none
                  `}
                  style={{ minHeight: '44px', minWidth: '44px' }} // iOS touch target guidelines
                >
                  <motion.div 
                    className="relative"
                    whileTap={{ scale: 0.9 }}
                    animate={active ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {active ? (
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                        <Icon className="h-5 w-5 text-white drop-shadow-sm" />
                      </div>
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="text-white text-xs font-bold">!</span>
                      </motion.div>
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium ${active ? 'font-semibold' : ''} transition-all duration-200`}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full shadow-glow"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Mobile Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-secondary-200/50 z-30 md:hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-sm drop-shadow-sm">S</span>
            </motion.div>
            <div>
              <h1 className="font-bold text-secondary-900 text-lg">Seek</h1>
              {user && (
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-secondary-500">
                    Welcome, {user.firstName}
                  </p>
                  <div className="flex items-center space-x-1">
                    <FireIcon className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">
                      {user?.progress?.streak || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Notifications */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="relative p-3 text-secondary-600 hover:text-secondary-900 rounded-xl hover:bg-secondary-50 transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <BellIcon className="h-6 w-6" />
              {hasNewNotifications && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse"
                />
              )}
            </motion.button>

            {/* Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="p-3 text-secondary-600 hover:text-secondary-900 rounded-xl hover:bg-secondary-50 transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Bars3Icon className="h-6 w-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay with Swipe Support */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              ref={menuRef}
              drag="x"
              dragControls={dragControls}
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/20"
            >
              {/* Enhanced Menu Header */}
              <div className="relative">
                {/* Drag Handle */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-secondary-300 rounded-full" />
                
                <div className="flex items-center justify-between p-6 pt-8 border-b border-white/20">
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {user?.avatar ? (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                      />
                    ) : (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
                      >
                        <span className="text-white font-bold text-lg drop-shadow-sm">
                          {user?.firstName?.charAt(0) || 'U'}
                        </span>
                      </motion.div>
                    )}
                    <div>
                      <h2 className="font-bold text-secondary-900 text-lg">
                        {user?.firstName || 'Guest User'}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-secondary-600 font-medium">
                            Level {user?.progress?.level || 1}
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-secondary-400 rounded-full" />
                        <span className="text-sm text-secondary-500">
                          {user?.progress?.xp || 0} XP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-3 text-secondary-400 hover:text-secondary-600 rounded-xl hover:bg-secondary-50 transition-colors"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>

              {/* Enhanced User Stats */}
              {user && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-gradient-to-r from-primary-50/50 to-purple-50/50 backdrop-blur-sm"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        {user.progress?.totalPoints || 0}
                      </div>
                      <div className="text-xs text-secondary-600 font-medium">Points</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {user.progress?.currentStreak || 0}
                      </div>
                      <div className="text-xs text-secondary-600 font-medium">Day Streak</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                        {user.progress?.completedExercises || 0}
                      </div>
                      <div className="text-xs text-secondary-600 font-medium">Completed</div>
                    </motion.div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-secondary-600 font-medium">Progress to next level</span>
                      <span className="text-xs text-secondary-500">{(user?.progress?.xp % 100) || 25}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2 backdrop-blur-sm">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(user?.progress?.xp % 100) || 25}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Menu Items */}
              <div className="p-6 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/50 active:bg-white/70 transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-white/20"
                      style={{ minHeight: '56px' }} // Touch-friendly height
                    >
                      {(() => {
                        const IconComponent = getMenuIcon(item.iconType);
                        return (
                          <div className="p-2 rounded-lg bg-gradient-to-r from-secondary-100 to-secondary-50">
                            <IconComponent className="h-5 w-5 text-secondary-600" />
                          </div>
                        );
                      })()}
                      <span className="font-medium text-secondary-700 flex-1">
                        {item.label}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-secondary-400 transform -rotate-90" />
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4 border-t border-white/20"
                >
                  <AITutorButton
                    variant="inline"
                    className="w-full justify-start p-4 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 hover:from-primary-100 hover:to-purple-100 border border-white/20"
                    context={{ type: 'general', page: 'mobile-menu' }}
                  >
                    <SparklesIcon className="h-5 w-5 mr-3 text-primary-600" />
                    Ask AI Tutor
                  </AITutorButton>
                </motion.div>
              </div>

              {/* Enhanced Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20 bg-gradient-to-t from-secondary-50/80 to-transparent backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <p className="text-sm font-medium text-secondary-700">
                    Seek Learning Platform
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    Version 1.0.0 • Made with ❤️
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-secondary-500">Online</span>
                  </div>
                </motion.div>
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