/* eslint-disable */
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';

// Import performance monitoring and service worker
import performanceMonitor from './utils/performanceMonitoring';
import { serviceWorkerManager } from './utils/serviceWorker';
import { initializeBrowserSupport } from './utils/browserDetection';
import performanceOptimizer from './utils/performanceOptimization';
import { initializeAnalytics, trackPageView } from './utils/analytics';

// Import browser compatibility styles
import './styles/browser-compatibility.css';

// Import components (keep these as regular imports for critical path)
import Layout from './components/layout/Layout';
import { LoadingPage } from './components/ui';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { PerformanceMonitorToggle } from './components/ui/PerformanceMonitor';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { SEOProvider } from './context/SEOContext';
import PageViewTracker from './components/analytics/PageViewTracker';
import OnboardingModal from './components/onboarding/OnboardingModal';

// Lazy load pages for code splitting
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tutorials = React.lazy(() => import('./pages/Tutorials'));
const DatabaseTutorials = React.lazy(() => import('./pages/DatabaseTutorials'));
const TutorialDetail = React.lazy(() => import('./pages/TutorialDetail'));
const TutorialLearn = React.lazy(() => import('./pages/TutorialLearn'));
const PlaygroundNew = React.lazy(() => import('./pages/Playground'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Translator = React.lazy(() => import('./pages/Translator'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Practice = React.lazy(() => import('./pages/Practice'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const ComponentsDemo = React.lazy(() => import('./pages/ComponentsDemo'));
const Challenges = React.lazy(() => import('./pages/Challenges'));
const Community = React.lazy(() => import('./pages/Community'));
const ChallengeDetail = React.lazy(() => import('./pages/ChallengeDetailEnhanced'));
const FeedbackForm = React.lazy(() => import('./components/Feedback/FeedbackForm'));
const BugReportForm = React.lazy(() => import('./components/BugReport/BugReportForm'));
const AdminDashboard = React.lazy(() => import('./components/Admin/AdminDashboard'));
const AdminFeedback = React.lazy(() => import('./components/Admin/AdminFeedback'));
const AdminBugReports = React.lazy(() => import('./components/Admin/AdminBugReports'));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const [onboardingDone, setOnboardingDone] = React.useState(
    () => !!localStorage.getItem('seek_onboarding_done')
  );

  // Also accept DB-level flag (synced into user.preferences on login)
  const isOnboardingDone = onboardingDone || !!user?.preferences?.onboardingDone;

  if (loading) {
    return <LoadingPage text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboardingDone) {
    return <OnboardingModal onComplete={() => {
      localStorage.setItem('seek_onboarding_done', '1');
      setOnboardingDone(true);
    }} />;
  }

  return children;
};

// Home Route — shows landing page to guests, redirects authenticated users to playground
const HomeRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/playground" replace />;
  }

  return (
    <Suspense fallback={<LoadingPage text="Loading..." />}>
      <LandingPage />
    </Suspense>
  );
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/playground" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Initialize browser detection and compatibility features
    const browserInfo = initializeBrowserSupport();

    // Initialize performance optimization and monitoring
    performanceOptimizer.init();

    // Initialize Google Analytics
    initializeAnalytics();

    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log('Performance monitoring initialized');
      console.log('Browser info:', browserInfo.browser);
    }

    // One-time service worker cleanup (runs only if a SW was previously registered)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        registrations.forEach(registration => registration.unregister());
      });
    }

    // serviceWorkerManager.register({
    //   onUpdate: (registration) => {
    //     console.log('New app version available');
    //     // You could show a toast notification here
    //   },
    //   onSuccess: (registration) => {
    //     console.log('App cached for offline use');
    //   }
    // });

    return () => {
      // Cleanup if needed
      performanceMonitor.destroy();
      performanceOptimizer.cleanup();
    };
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SEOProvider>
              <PageViewTracker />
              <ThemeProvider>
                <ToastProvider>
                  <AuthProvider>
                    <SocketProvider>
                      <div className="App">
                        <Routes>
                          {/* Landing page — guests see it, authenticated users go to playground */}
                          <Route path="/" element={<HomeRoute />} />

                          {/* Public routes */}
                          <Route
                            path="/login"
                            element={
                              <PublicRoute>
                                <Suspense fallback={<LoadingPage text="Loading login..." />}>
                                  <Login />
                                </Suspense>
                              </PublicRoute>
                            }
                          />
                          <Route
                            path="/register"
                            element={
                              <PublicRoute>
                                <Suspense fallback={<LoadingPage text="Loading registration..." />}>
                                  <Register />
                                </Suspense>
                              </PublicRoute>
                            }
                          />

                          {/* Protected layout — pathless so it doesn't conflict with "/" landing route */}
                          <Route
                            element={
                              <ProtectedRoute>
                                <Layout />
                              </ProtectedRoute>
                            }
                          >
                            <Route path="/dashboard" element={
                              <Suspense fallback={<LoadingPage text="Loading dashboard..." />}>
                                <Dashboard />
                              </Suspense>
                            } />
                            <Route path="/tutorials" element={
                              <Suspense fallback={<LoadingPage text="Loading tutorials..." />}>
                                <Tutorials />
                              </Suspense>
                            } />
                            <Route path="/database-tutorials" element={
                              <Suspense fallback={<LoadingPage text="Loading database tutorials..." />}>
                                <DatabaseTutorials />
                              </Suspense>
                            } />
                            <Route path="/playground" element={
                              <Suspense fallback={<LoadingPage text="Loading playground..." />}>
                                <PlaygroundNew />
                              </Suspense>
                            } />
                            <Route path="/translator" element={
                              <Suspense fallback={<LoadingPage text="Loading translator..." />}>
                                <Translator />
                              </Suspense>
                            } />
                            <Route path="/practice" element={
                              <Suspense fallback={<LoadingPage text="Loading practice..." />}>
                                <Practice />
                              </Suspense>
                            } />
                            <Route path="/challenges" element={
                              <Suspense fallback={<LoadingPage text="Loading challenges..." />}>
                                <Challenges />
                              </Suspense>
                            } />
                            <Route path="/community" element={
                              <Suspense fallback={<LoadingPage text="Loading community forum..." />}>
                                <Community />
                              </Suspense>
                            } />
                            <Route path="/challenges/:slug" element={
                              <Suspense fallback={<LoadingPage text="Loading challenge..." />}>
                                <ChallengeDetail />
                              </Suspense>
                            } />
                            <Route path="/achievements" element={
                              <Suspense fallback={<LoadingPage text="Loading achievements..." />}>
                                <Achievements />
                              </Suspense>
                            } />
                            <Route path="/profile" element={
                              <Suspense fallback={<LoadingPage text="Loading profile..." />}>
                                <Profile />
                              </Suspense>
                            } />
                            <Route path="/settings" element={
                              <Suspense fallback={<LoadingPage text="Loading settings..." />}>
                                <Settings />
                              </Suspense>
                            } />
                            <Route path="/components-demo" element={
                              <Suspense fallback={<LoadingPage text="Loading demo..." />}>
                                <ComponentsDemo />
                              </Suspense>
                            } />

                            {/* Tutorial routes */}
                            <Route path="/tutorials/:id" element={
                              <Suspense fallback={<LoadingPage text="Loading tutorial..." />}>
                                <TutorialDetail />
                              </Suspense>
                            } />
                            <Route path="/tutorials/:id/learn" element={
                              <Suspense fallback={<LoadingPage text="Loading lesson..." />}>
                                <TutorialLearn />
                              </Suspense>
                            } />

                            {/* Feedback and Bug Report routes */}
                            <Route path="/feedback" element={
                              <Suspense fallback={<LoadingPage text="Loading feedback form..." />}>
                                <FeedbackForm />
                              </Suspense>
                            } />
                            <Route path="/report-bug" element={
                              <Suspense fallback={<LoadingPage text="Loading bug report form..." />}>
                                <BugReportForm />
                              </Suspense>
                            } />

                            {/* Admin routes */}
                            <Route path="/admin/dashboard" element={
                              <Suspense fallback={<LoadingPage text="Loading admin dashboard..." />}>
                                <AdminDashboard />
                              </Suspense>
                            } />
                            <Route path="/admin/feedback" element={
                              <Suspense fallback={<LoadingPage text="Loading feedback management..." />}>
                                <AdminFeedback />
                              </Suspense>
                            } />
                            <Route path="/admin/bug-reports" element={
                              <Suspense fallback={<LoadingPage text="Loading bug reports management..." />}>
                                <AdminBugReports />
                              </Suspense>
                            } />

                            <Route path="/progress" element={<div>Progress Page (Coming Soon)</div>} />
                          </Route>

                          {/* Catch all - redirect to landing page */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>

                        {/* Performance Monitor (Development only) */}
                        <PerformanceMonitorToggle />
                      </div>
                    </SocketProvider>
                  </AuthProvider>
                </ToastProvider>
              </ThemeProvider>
            </SEOProvider>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
