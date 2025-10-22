import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  CodeBracketIcon,
  PlayIcon,
  TrophyIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  BookOpenIcon as BookSolid,
  CodeBracketIcon as CodeSolid,
  PlayIcon as PlaySolid,
  TrophyIcon as TrophySolid
} from '@heroicons/react/24/solid';
import TouchButton from '../ui/TouchButton';
import { hapticFeedback } from '../../utils/touchInteractions';

const BottomNavigation = ({ className = '' }) => {
  const location = useLocation();
  const [showFab, setShowFab] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeSolid,
      color: 'text-primary-600',
      activeColor: 'text-white',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      path: '/tutorials',
      label: 'Learn',
      icon: BookOpenIcon,
      activeIcon: BookSolid,
      color: 'text-green-600',
      activeColor: 'text-white',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      path: '/playground',
      label: 'Code',
      icon: CodeBracketIcon,
      activeIcon: CodeSolid,
      color: 'text-purple-600',
      activeColor: 'text-white',
      gradient: 'from-purple-500 to-pink-600',
      isFab: true
    },
    {
      path: '/practice',
      label: 'Practice',
      icon: PlayIcon,
      activeIcon: PlaySolid,
      color: 'text-orange-600',
      activeColor: 'text-white',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      path: '/achievements',
      label: 'Progress',
      icon: TrophyIcon,
      activeIcon: TrophySolid,
      color: 'text-yellow-600',
      activeColor: 'text-white',
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  const fabActions = [
    {
      path: '/playground/new',
      label: 'New Code',
      icon: CodeBracketIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      path: '/tutorials/ai-help',
      label: 'AI Tutor',
      icon: SparklesIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  // Handle scroll to show/hide navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path, isFab = false) => {
    hapticFeedback.light();
    
    if (isFab) {
      setShowFab(!showFab);
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden ${className}`}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl" />
        
        {/* Navigation Items */}
        <div className="relative grid grid-cols-5 h-20 px-2">
          {navigationItems.map((item, index) => {
            const Icon = isActive(item.path) ? item.activeIcon : item.icon;
            const active = isActive(item.path);
            
            if (item.isFab) {
              // Floating Action Button
              return (
                <div key={item.path} className="flex items-center justify-center">
                  <motion.div
                    className="absolute -top-6"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TouchButton
                      variant="primary"
                      size="lg"
                      onPress={() => handleNavigation(item.path, true)}
                      haptic="medium"
                      className={`w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r ${item.gradient} border-4 border-white`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </TouchButton>
                  </motion.div>
                </div>
              );
            }

            return (
              <motion.div
                key={item.path}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center"
              >
                <Link
                  to={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200 touch-manipulation select-none min-h-[44px] min-w-[44px]"
                >
                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.9 }}
                    animate={active ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {active ? (
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                      </div>
                    ) : (
                      <div className="p-2">
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                    )}
                  </motion.div>
                  
                  <span className={`text-xs font-medium transition-all duration-200 ${
                    active 
                      ? 'text-gray-900 font-semibold' 
                      : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Safe Area Padding */}
        <div className="h-safe-area-inset-bottom bg-white/95" />
      </motion.div>

      {/* FAB Actions Menu */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 md:hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center space-y-3">
              {fabActions.map((action, index) => (
                <motion.div
                  key={action.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={action.path} onClick={() => setShowFab(false)}>
                    <TouchButton
                      variant="ghost"
                      size="lg"
                      haptic="light"
                      className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white border-2 border-white/20`}
                    >
                      <action.icon className="h-6 w-6" />
                    </TouchButton>
                  </Link>
                  
                  {/* Label */}
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {action.label}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Backdrop */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFab(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Spacer */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default BottomNavigation;