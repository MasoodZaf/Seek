import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  FireIcon,
  StarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TouchButton from '../ui/TouchButton';
import { hapticFeedback } from '../../utils/touchInteractions';

const ResponsiveHeader = ({ 
  title,
  showBackButton = false,
  onBack,
  actions = [],
  className = ''
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle scroll to show/hide header on mobile
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

    // Only apply scroll behavior on mobile
    if (window.innerWidth < 768) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowNotifications(false);
    setShowSearch(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    if (title) return title;
    
    const pathTitles = {
      '/dashboard': 'Dashboard',
      '/tutorials': 'Tutorials',
      '/playground': 'Code Playground',
      '/practice': 'Practice',
      '/achievements': 'Achievements',
      '/profile': 'Profile',
      '/settings': 'Settings'
    };
    
    return pathTitles[location.pathname] || 'Seek';
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: UserCircleIcon,
      path: '/profile'
    },
    {
      label: 'Settings',
      icon: CogIcon,
      path: '/settings'
    },
    {
      label: 'Help & Support',
      icon: QuestionMarkCircleIcon,
      path: '/help'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    hapticFeedback.medium();
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm ${className}`}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {showBackButton ? (
              <TouchButton
                variant="ghost"
                size="sm"
                onPress={onBack}
                haptic="light"
                className="md:hidden"
              >
                <ChevronDownIcon className="h-6 w-6 transform rotate-90" />
              </TouchButton>
            ) : (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white font-bold text-sm drop-shadow-sm">S</span>
                  </motion.div>
                  <div className="hidden sm:block">
                    <h1 className="font-bold text-gray-900 text-lg">Seek</h1>
                  </div>
                </Link>
                
                {/* Page Title on Mobile */}
                <div className="sm:hidden">
                  <h1 className="font-semibold text-gray-900 text-lg">
                    {getPageTitle()}
                  </h1>
                </div>
              </motion.div>
            )}
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutorials, code examples..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Custom Actions */}
            {actions.map((action, index) => (
              <TouchButton
                key={index}
                variant="ghost"
                size="sm"
                onPress={action.onPress}
                haptic="light"
                className="hidden sm:flex"
              >
                <action.icon className="h-5 w-5" />
              </TouchButton>
            ))}

            {/* Search Button (Mobile) */}
            <TouchButton
              variant="ghost"
              size="sm"
              onPress={() => setShowSearch(true)}
              haptic="light"
              className="md:hidden"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </TouchButton>

            {/* Notifications */}
            <TouchButton
              variant="ghost"
              size="sm"
              onPress={() => setShowNotifications(!showNotifications)}
              haptic="light"
              className="relative"
            >
              <BellIcon className="h-6 w-6" />
              {/* Notification Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full shadow-lg"
              />
            </TouchButton>

            {/* User Menu */}
            <TouchButton
              variant="ghost"
              size="sm"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
              haptic="light"
              className="flex items-center space-x-2"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </TouchButton>
          </div>
        </div>

        {/* User Stats Bar (Mobile) */}
        {user && (
          <motion.div 
            className="px-4 py-2 border-t border-gray-200/50 bg-gradient-to-r from-primary-50/50 to-purple-50/50 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Level {user?.progress?.level || 1}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FireIcon className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{user?.progress?.streak || 0} day streak</span>
                </div>
              </div>
              <div className="text-primary-600 font-medium">
                {user?.progress?.xp || 0} XP
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-0 z-50 bg-white md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center p-4 border-b border-gray-200">
              <TouchButton
                variant="ghost"
                size="sm"
                onPress={() => setShowSearch(false)}
                haptic="light"
                className="mr-3"
              >
                <XMarkIcon className="h-6 w-6" />
              </TouchButton>
              
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tutorials, code examples..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </form>
            </div>
            
            {/* Search Results would go here */}
            <div className="p-4">
              <p className="text-gray-500 text-center">Start typing to search...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute top-full right-4 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-40 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* User Info */}
            {user && (
              <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full border-2 border-white/20 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-lg">
                        {user.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="border-t border-gray-200/50 mt-2 pt-2">
                <TouchButton
                  variant="ghost"
                  size="md"
                  onPress={handleLogout}
                  haptic="medium"
                  className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Sign Out
                </TouchButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="absolute top-full right-4 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-40 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="p-4 border-b border-gray-200/50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              <div className="p-4 text-center text-gray-500">
                <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No new notifications</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for dropdowns */}
      <AnimatePresence>
        {(isMenuOpen || showNotifications) && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsMenuOpen(false);
              setShowNotifications(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsiveHeader;