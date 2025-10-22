import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ResponsiveHeader from '../mobile/ResponsiveHeader';
import BottomNavigation from '../mobile/BottomNavigation';
import Sidebar from './Sidebar';
import { useResponsive } from '../../hooks/useResponsive';

const ResponsiveLayout = ({ 
  children, 
  title,
  showBackButton = false,
  onBack,
  headerActions = [],
  className = '',
  fullWidth = false,
  noPadding = false
}) => {
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, sidebarOpen]);

  const getLayoutClasses = () => {
    if (fullWidth) return 'w-full';
    
    if (isDesktop) {
      return 'max-w-7xl mx-auto px-6';
    } else if (isTablet) {
      return 'max-w-4xl mx-auto px-4';
    } else {
      return 'w-full px-4';
    }
  };

  const getContentPadding = () => {
    if (noPadding) return '';
    
    if (isMobile) {
      return 'py-4';
    } else {
      return 'py-6';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <Sidebar 
          isOpen={true}
          onClose={() => {}}
          className="fixed left-0 top-0 h-full"
        />
      )}

      {/* Mobile/Tablet Sidebar Overlay */}
      <AnimatePresence>
        {!isDesktop && sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              className="absolute left-0 top-0 h-full"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <Sidebar 
                isOpen={true}
                onClose={() => setSidebarOpen(false)}
                isMobile={!isDesktop}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`${isDesktop ? 'ml-64' : ''} min-h-screen flex flex-col`}>
        {/* Header */}
        <ResponsiveHeader
          title={title}
          showBackButton={showBackButton}
          onBack={onBack}
          actions={[
            ...headerActions,
            ...(isDesktop ? [] : [{
              icon: ({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ),
              onPress: () => setSidebarOpen(true)
            }])
          ]}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className={`${getLayoutClasses()} ${getContentPadding()} ${className}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNavigation />}
      </div>

      {/* Responsive Typography Scaling */}
      <style jsx global>{`
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
          
          h1 {
            font-size: 1.5rem;
            line-height: 1.3;
          }
          
          h2 {
            font-size: 1.25rem;
            line-height: 1.4;
          }
          
          h3 {
            font-size: 1.125rem;
            line-height: 1.4;
          }
          
          .text-xs {
            font-size: 0.75rem;
          }
          
          .text-sm {
            font-size: 0.875rem;
          }
          
          .text-base {
            font-size: 1rem;
          }
          
          .text-lg {
            font-size: 1.125rem;
          }
          
          .text-xl {
            font-size: 1.25rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          html {
            font-size: 15px;
          }
        }
        
        @media (min-width: 769px) {
          html {
            font-size: 16px;
          }
        }
        
        /* Touch-friendly spacing on mobile */
        @media (max-width: 640px) {
          .space-y-1 > * + * {
            margin-top: 0.375rem;
          }
          
          .space-y-2 > * + * {
            margin-top: 0.5rem;
          }
          
          .space-y-3 > * + * {
            margin-top: 0.75rem;
          }
          
          .space-y-4 > * + * {
            margin-top: 1rem;
          }
          
          .space-x-1 > * + * {
            margin-left: 0.375rem;
          }
          
          .space-x-2 > * + * {
            margin-left: 0.5rem;
          }
          
          .space-x-3 > * + * {
            margin-left: 0.75rem;
          }
          
          .space-x-4 > * + * {
            margin-left: 1rem;
          }
        }
        
        /* Safe area support for devices with notches */
        @supports (padding: max(0px)) {
          .h-safe-area-inset-bottom {
            height: env(safe-area-inset-bottom);
          }
          
          .pb-safe-area {
            padding-bottom: env(safe-area-inset-bottom);
          }
          
          .pt-safe-area {
            padding-top: env(safe-area-inset-top);
          }
        }
        
        /* Improved touch targets */
        @media (max-width: 640px) {
          button, 
          a[role="button"], 
          input[type="button"], 
          input[type="submit"], 
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Larger tap targets for interactive elements */
          .tap-target-large {
            min-height: 56px;
            min-width: 56px;
          }
        }
        
        /* Smooth scrolling for better mobile experience */
        html {
          scroll-behavior: smooth;
        }
        
        /* Prevent horizontal scroll on mobile */
        body {
          overflow-x: hidden;
        }
        
        /* Better focus indicators for keyboard navigation */
        *:focus {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }
        
        /* Hide focus outline for mouse users */
        .js-focus-visible *:focus:not(.focus-visible) {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveLayout;