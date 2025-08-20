import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = ({ className = '', size = 'md' }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const buttonSizes = {
    sm: 'p-1',
    md: 'p-2', 
    lg: 'p-3'
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`${buttonSizes[size]} rounded-lg transition-colors ${
        isDarkMode 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <SunIcon className={sizeClasses[size]} />
      ) : (
        <MoonIcon className={sizeClasses[size]} />
      )}
    </button>
  );
};

export default DarkModeToggle;