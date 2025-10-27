import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { LoadingPage } from '../ui';
import { RouteTransition } from '../ui/PageTransition';
import SkipNavigation from '../ui/SkipNavigation';
import KeyboardShortcutsHelp from '../ui/KeyboardShortcutsHelp';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { keyboardShortcutManager } from '../../utils/keyboardNavigation';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
  const { loading } = useAuth();
  const { isDarkMode } = useTheme();

  // Setup keyboard shortcuts for layout
  useEffect(() => {
    // Help shortcut
    keyboardShortcutManager.register('?', () => {
      setShortcutsHelpOpen(true);
    }, { description: 'Show keyboard shortcuts help' });

    // Sidebar toggle
    keyboardShortcutManager.register('s', () => {
      setSidebarOpen(prev => !prev);
    }, { description: 'Toggle sidebar' });

    // Focus main content
    keyboardShortcutManager.register('m', () => {
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }, { description: 'Focus main content' });

    return () => {
      keyboardShortcutManager.unregister('?');
      keyboardShortcutManager.unregister('s');
      keyboardShortcutManager.unregister('m');
    };
  }, []);

  // Handle sidebar close on escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [sidebarOpen]);
  
  if (loading) {
    return <LoadingPage text="Setting up your workspace..." />;
  }
  
  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-secondary-50'
    }`}>
      {/* Skip Navigation Links */}
      <SkipNavigation 
        links={[
          { href: '#main-content', text: 'Skip to main content' },
          { href: '#navigation', text: 'Skip to navigation' },
          { href: '#sidebar', text: 'Skip to sidebar' }
        ]}
      />

      <AnimatePresence>
        <Sidebar 
          id="sidebar"
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </AnimatePresence>
      
      <div className="flex flex-col w-0 flex-1 overflow-x-hidden">
        <Header
          id="navigation"
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main 
          id="main-content"
          className="flex-1 relative overflow-y-auto focus:outline-none"
          tabIndex="-1"
          role="main"
          aria-label="Main content"
        >
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <RouteTransition>
                <Outlet />
              </RouteTransition>
            </div>
          </div>
        </main>
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp 
        isOpen={shortcutsHelpOpen}
        onClose={() => setShortcutsHelpOpen(false)}
      />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Accessibility announcements */}
      <div 
        id="accessibility-announcements"
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
    </div>
  );
};

export default Layout;