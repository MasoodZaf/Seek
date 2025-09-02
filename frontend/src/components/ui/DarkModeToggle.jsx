import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const DarkModeToggle = ({ 
  className = '', 
  size = 'md', 
  variant = 'default',
  showLabel = false 
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizes = {
    sm: 'p-2',
    md: 'p-2.5', 
    lg: 'p-3'
  };

  const variants = {
    default: isDarkMode 
      ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border-gray-600' 
      : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300',
    ghost: isDarkMode
      ? 'text-yellow-400 hover:bg-gray-800/50'
      : 'text-gray-600 hover:bg-gray-100/50',
    toggle: 'bg-gray-200 dark:bg-gray-700 relative'
  };

  if (variant === 'toggle') {
    return (
      <motion.button
        onClick={toggleDarkMode}
        className={clsx(
          'relative w-14 h-7 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          variants[variant],
          className
        )}
        whileTap={{ scale: 0.95 }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        role="switch"
        aria-checked={isDarkMode}
      >
        <motion.div
          className="absolute top-0.5 w-6 h-6 bg-white dark:bg-gray-300 rounded-full shadow-md flex items-center justify-center"
          animate={{ x: isDarkMode ? 28 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <MoonIcon className="h-3 w-3 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <SunIcon className="h-3 w-3 text-yellow-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={clsx(
        buttonSizes[size],
        'relative rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        className="relative"
        animate={{ rotate: isDarkMode ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isDarkMode ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <SunIcon className={sizeClasses[size]} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <MoonIcon className={sizeClasses[size]} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      )}
    </motion.button>
  );
};

export default DarkModeToggle;