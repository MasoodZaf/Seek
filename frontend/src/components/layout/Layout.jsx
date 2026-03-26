import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import {
  HomeIcon,
  CommandLineIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { LoadingPage } from '../ui';
import { RouteTransition } from '../ui/PageTransition';
import SkipNavigation from '../ui/SkipNavigation';
import KeyboardShortcutsHelp from '../ui/KeyboardShortcutsHelp';
import MobileNavigation from '../mobile/MobileNavigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { keyboardShortcutManager } from '../../utils/keyboardNavigation';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
  const { loading } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();

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
    <div className="h-screen flex overflow-hidden" style={{ background: '#111110' }}>
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
        <div className="hidden md:block">
          <Header
            id="navigation"
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        <MobileNavigation />

        <main
          id="main-content"
          className="flex-1 relative focus:outline-none pb-16 md:pb-0 overflow-y-auto"
          tabIndex="-1"
          role="main"
          aria-label="Main content"
        >
          {location.pathname === '/playground' || location.pathname === '/translator' ? (
            <div className="px-4 py-3">
              <Outlet />
            </div>
          ) : (
            /* All other pages: normal padded scrollable layout */
            <>
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  {/* Breadcrumb Navigation */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hidden lg:flex items-center space-x-2 mb-6"
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
                              ? 'text-primary-600 bg-primary-50/50 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50/50 dark:text-secondary-400 dark:hover:text-secondary-200 dark:hover:bg-secondary-800/50'
                          )}
                        >
                          <crumb.icon className="h-4 w-4" />
                          <span>{crumb.name}</span>
                        </Link>
                      </React.Fragment>
                    ))}
                  </motion.div>

                  <RouteTransition>
                    <Outlet />
                  </RouteTransition>
                </div>
              </div>
              <Footer />
            </>
          )}
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
            background: '#1e1e24',
            color: '#f5f0e8',
            border: '1px solid rgba(255,255,255,0.1)',
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