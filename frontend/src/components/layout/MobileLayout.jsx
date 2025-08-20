import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WifiIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import MobileNavigation from '../mobile/MobileNavigation';
import AITutorButton from '../ai/AITutorButton';
import { useAuth } from '../../context/AuthContext';
import offlineService from '../../services/offlineService';
import notificationService from '../../services/notificationService';

const MobileLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // PWA Install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Connection status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowOfflineNotice(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Notification permission prompt
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if (!user) return;
      
      const hasPrompted = localStorage.getItem('notificationPrompted');
      const permission = Notification.permission;
      
      // Show prompt after user has been active for 5 minutes and hasn't been prompted
      if (!hasPrompted && permission === 'default') {
        setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 5 * 60 * 1000); // 5 minutes
      }
    };

    checkNotificationPermission();
  }, [user]);

  // Handle PWA installation
  const handleInstallApp = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted PWA installation');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  // Handle notification permission
  const handleNotificationPermission = async (allow) => {
    localStorage.setItem('notificationPrompted', 'true');
    setShowNotificationPrompt(false);

    if (allow) {
      const result = await notificationService.requestPermission();
      if (result.success) {
        await notificationService.subscribe();
        // Set up initial reminders
        if (user) {
          notificationService.setupStreakReminders(user);
          notificationService.scheduleWeeklySummary();
        }
      }
    }
  };

  // Determine if current route should show floating AI button
  const showFloatingAI = ['/playground', '/tutorials', '/practice'].some(
    route => location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-secondary-50 md:bg-white">
      {/* Mobile-only navigation */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>

      {/* Main content area */}
      <main className="md:container md:mx-auto md:px-4">
        <Outlet />
      </main>

      {/* Connection Status Notice */}
      <AnimatePresence>
        {showOfflineNotice && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-16 left-4 right-4 z-50 md:hidden"
          >
            <div className={`
              flex items-center space-x-3 p-3 rounded-lg shadow-lg
              ${isOnline 
                ? 'bg-success-50 border border-success-200' 
                : 'bg-warning-50 border border-warning-200'
              }
            `}>
              {isOnline ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 text-success-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-success-800">
                      Back online!
                    </p>
                    <p className="text-xs text-success-600">
                      Syncing your progress...
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-warning-800">
                      You're offline
                    </p>
                    <p className="text-xs text-warning-600">
                      Some features may be limited
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-primary-600 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    Install Seek App
                  </h3>
                  <p className="text-xs text-primary-100 mb-3">
                    Get the full mobile experience with offline access
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleInstallApp}
                      className="bg-white text-primary-600 px-3 py-1 rounded text-xs font-medium"
                    >
                      Install
                    </button>
                    <button
                      onClick={() => setIsInstallable(false)}
                      className="text-primary-100 px-3 py-1 text-xs"
                    >
                      Not now
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setIsInstallable(false)}
                  className="text-primary-100 p-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Permission Prompt */}
      <AnimatePresence>
        {showNotificationPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-secondary-900 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    Stay motivated! 🔥
                  </h3>
                  <p className="text-xs text-secondary-300 mb-3">
                    Get reminders to keep your coding streak alive
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleNotificationPermission(true)}
                      className="bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Enable
                    </button>
                    <button
                      onClick={() => handleNotificationPermission(false)}
                      className="text-secondary-300 px-3 py-1 text-xs"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotificationPrompt(false)}
                  className="text-secondary-400 p-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Tutor Button */}
      {showFloatingAI && user && (
        <div className="md:hidden">
          <AITutorButton
            variant="floating"
            context={{
              type: 'general',
              page: location.pathname.split('/')[1],
              isMobile: true
            }}
            className="bottom-20"
          />
        </div>
      )}

      {/* Offline Status Indicator */}
      {!isOnline && (
        <div className="fixed top-16 right-4 z-30 md:hidden">
          <div className="bg-secondary-700 text-white p-2 rounded-full shadow-lg">
            <WifiIcon className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;