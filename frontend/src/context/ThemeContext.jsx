/* eslint-disable */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = ['midnight', 'ocean', 'daylight'];

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme called outside of ThemeProvider context');
    return {
      theme: 'midnight',
      setTheme: () => {},
      isDarkMode: true,
      toggleDarkMode: () => {},
      setIsDarkMode: () => {}
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('seek_theme');
    return THEMES.includes(saved) ? saved : 'midnight';
  });

  const setTheme = (newTheme) => {
    if (THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  useEffect(() => {
    localStorage.setItem('seek_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Keep Tailwind dark class in sync — midnight and ocean are dark
    if (theme === 'daylight') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Backward-compat: isDarkMode / toggleDarkMode for existing components
  const isDarkMode = theme !== 'daylight';
  const toggleDarkMode = () => setTheme(isDarkMode ? 'daylight' : 'midnight');
  const setIsDarkMode = (dark) => setTheme(dark ? 'midnight' : 'daylight');

  const value = {
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
    setIsDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
