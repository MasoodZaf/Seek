import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 text-gray-300'
          : 'bg-white border-gray-200 text-gray-600'
      }`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Copyright */}
          <div className="text-sm">
            <span className="font-medium">© {currentYear} Seek Learning Platform</span>
            <span className="mx-2">•</span>
            <span>All rights reserved</span>
          </div>

          {/* Developers Credit */}
          <div className={`text-sm flex items-center gap-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>Developed with</span>
            <span className="text-red-500">❤️</span>
            <span>by</span>
            <span className={`font-semibold ${
              isDarkMode
                ? 'text-primary-400 hover:text-primary-300'
                : 'text-primary-600 hover:text-primary-700'
            } transition-colors cursor-default`}>
              MBZ Tech and 6 Nerds
            </span>
          </div>
        </div>

        {/* Optional: Additional Links Row */}
        <div className={`mt-3 pt-3 border-t flex flex-wrap items-center justify-center gap-4 text-xs ${
          isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          <a
            href="/about"
            className="hover:underline hover:text-primary-500 transition-colors"
          >
            About
          </a>
          <span>•</span>
          <a
            href="/privacy"
            className="hover:underline hover:text-primary-500 transition-colors"
          >
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="/terms"
            className="hover:underline hover:text-primary-500 transition-colors"
          >
            Terms of Service
          </a>
          <span>•</span>
          <a
            href="/contact"
            className="hover:underline hover:text-primary-500 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
