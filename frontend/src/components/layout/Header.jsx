import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  HomeIcon,
  XMarkIcon,
  CommandLineIcon,
  BookOpenIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Button, Input } from '../ui';
import DarkModeToggle from '../ui/DarkModeToggle';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [notifications] = useState([
    { id: 1, title: 'New tutorial available', time: '2 min ago', unread: true },
    { id: 2, title: 'Progress milestone reached', time: '1 hour ago', unread: false },
    { id: 3, title: 'Weekly challenge completed', time: '3 hours ago', unread: true },
  ]);
  const userMenuButtonRef = useRef(null);
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, right: 0 });

  const unreadCount = notifications.filter(n => n.unread).length;

  // Breadcrumb mapping
  const breadcrumbMap = {
    '/dashboard': [{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon }],
    '/playground': [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Code Playground', href: '/playground', icon: CommandLineIcon }
    ],
    '/tutorials': [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Tutorials', href: '/tutorials', icon: BookOpenIcon }
    ],
    '/progress': [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'My Progress', href: '/progress', icon: ChartBarIcon }
    ],
  };

  const currentBreadcrumbs = breadcrumbMap[location.pathname] || [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon }
  ];

  // Mock search suggestions
  const mockSuggestions = [
    { type: 'tutorial', title: 'React Hooks Tutorial', category: 'React' },
    { type: 'tutorial', title: 'JavaScript Fundamentals', category: 'JavaScript' },
    { type: 'topic', title: 'State Management', category: 'Concepts' },
    { type: 'tutorial', title: 'CSS Grid Layout', category: 'CSS' },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setIsSearchFocused(false);
    // Navigate to suggestion
  };
  
  return (
    <header className={`relative border-b transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700/50 backdrop-blur-xl' 
        : 'bg-white/80 border-secondary-200/50 backdrop-blur-xl'
    } shadow-lg shadow-black/5`}>
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent pointer-events-none" />
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex items-center space-x-2 py-2 border-b border-white/10"
        >
          {currentBreadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-secondary-400" />
              )}
              <Link
                to={crumb.href}
                className={clsx(
                  'flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover-lift',
                  index === currentBreadcrumbs.length - 1
                    ? 'text-primary-600 bg-primary-50/50'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50/50'
                )}
              >
                <crumb.icon className="h-4 w-4" />
                <span>{crumb.name}</span>
              </Link>
            </React.Fragment>
          ))}
        </motion.div>

        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and search */}
          <div className="flex items-center space-x-4">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20"
                onClick={onMenuClick}
              >
                <Bars3Icon className="h-6 w-6" />
              </Button>
            </motion.div>
            
            {/* Enhanced Search with Autocomplete */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: isSearchFocused ? 1.02 : 1,
                      boxShadow: isSearchFocused 
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    className="relative"
                  >
                    <Input
                      type="text"
                      placeholder="Search tutorials, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      leftIcon={MagnifyingGlassIcon}
                      className="w-96 backdrop-blur-sm bg-white/90 border-white/20 focus:bg-white/95 transition-all duration-300"
                    />
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-secondary-100 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4 text-secondary-400" />
                      </motion.button>
                    )}
                  </motion.div>
                </div>

                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-[9999] max-h-64 overflow-y-auto"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-primary-50/50 transition-colors flex items-center space-x-3"
                        >
                          <div className={clsx(
                            'w-2 h-2 rounded-full',
                            suggestion.type === 'tutorial' ? 'bg-blue-400' : 'bg-green-400'
                          )} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900">
                              {suggestion.title}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {suggestion.category}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
          
          {/* Right side - Actions and user menu */}
          <div className="flex items-center space-x-3">
            {/* Search button for mobile */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Button>
            </motion.div>
            
            {/* Theme toggle */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <DarkModeToggle variant="default" size="sm" className="backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20" />
            </motion.div>
            
            {/* Enhanced Notifications */}
            <Menu as="div" className="relative">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Menu.Button as={Button} variant="ghost" size="sm" className="relative backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20">
                  <BellIcon className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse-glow"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Menu.Button>
              </motion.div>
              
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-[9999]">
                  <div className="px-4 py-3 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-secondary-900">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="text-xs text-primary-600 font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={clsx(
                              'px-4 py-3 transition-all duration-200 cursor-pointer relative',
                              active && 'bg-primary-50/50',
                              notification.unread && 'bg-gradient-to-r from-primary-50/30 to-transparent border-l-2 border-primary-400'
                            )}
                          >
                            <div className="flex items-start space-x-3">
                              {notification.unread && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-secondary-900">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-white/20">
                    <Button variant="ghost" size="sm" className="w-full text-left hover:bg-primary-50/50">
                      View all notifications
                    </Button>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            
            {/* Enhanced User menu */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Menu.Button
                      ref={userMenuButtonRef}
                      onClick={() => {
                        if (userMenuButtonRef.current) {
                          const rect = userMenuButtonRef.current.getBoundingClientRect();
                          setUserMenuPosition({
                            top: rect.bottom + 8,
                            right: window.innerWidth - rect.right
                          });
                        }
                      }}
                      className="flex items-center space-x-3 p-2 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 hover-lift"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="h-8 w-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="text-sm font-semibold text-white drop-shadow-sm">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </motion.div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-secondary-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {user?.role || 'Student'}
                        </p>
                      </div>
                    </Menu.Button>
                  </motion.div>

                  {open && createPortal(
                    <Transition
                      show={open}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        style={{
                          position: 'fixed',
                          top: `${userMenuPosition.top}px`,
                          right: `${userMenuPosition.right}px`,
                          zIndex: 99999
                        }}
                        className="w-56 bg-white backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 py-2"
                      >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-secondary-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Level {user?.progress?.level || 1} • {user?.progress?.xp || 0} XP
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={clsx(
                            'flex items-center px-4 py-2 text-sm text-secondary-700 transition-all duration-200',
                            active && 'bg-primary-50/50 text-primary-700'
                          )}
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          View Profile
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={clsx(
                            'flex items-center px-4 py-2 text-sm text-secondary-700 transition-all duration-200',
                            active && 'bg-primary-50/50 text-primary-700'
                          )}
                        >
                          <CogIcon className="h-4 w-4 mr-3" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  
                  <div className="border-t border-white/20 my-1" />
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm text-red-600 transition-all duration-200',
                          active && 'bg-red-50/50'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                      </Menu.Items>
                    </Transition>,
                    document.body
                  )}
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;