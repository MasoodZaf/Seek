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

// Lazy load pages for code splitting
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tutorials = React.lazy(() => import('./pages/Tutorials'));
const TutorialDetail = React.lazy(() => import('./pages/TutorialDetail'));
const TutorialLearn = React.lazy(() => import('./pages/TutorialLearn'));
const PlaygroundNew = React.lazy(() => import('./pages/PlaygroundNew'));
const CodeTranslator = React.lazy(() => import('./pages/CodeTranslator'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Practice = React.lazy(() => import('./pages/Practice'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const ComponentsDemo = React.lazy(() => import('./pages/ComponentsDemo'));

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
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingPage text="Checking authentication..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
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
    
    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log('Performance monitoring initialized');
      console.log('Browser info:', browserInfo.browser);
    }

    // Register service worker - DISABLED TEMPORARILY TO FIX LOGIN ISSUE
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
            <ThemeProvider>
              <ToastProvider>
                <AuthProvider>
                  <SocketProvider>
                    <div className="App">
                      <Routes>
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
                        
                        {/* Protected routes */}
                        <Route 
                          path="/" 
                          element={
                            <ProtectedRoute>
                              <Layout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Navigate to="/playground" replace />} />
                          <Route path="dashboard" element={
                            <Suspense fallback={<LoadingPage text="Loading dashboard..." />}>
                              <Dashboard />
                            </Suspense>
                          } />
                          <Route path="tutorials" element={
                            <Suspense fallback={<LoadingPage text="Loading tutorials..." />}>
                              <Tutorials />
                            </Suspense>
                          } />
                          <Route path="playground" element={
                            <Suspense fallback={<LoadingPage text="Loading playground..." />}>
                              <PlaygroundNew />
                            </Suspense>
                          } />
                          <Route path="translator" element={
                            <Suspense fallback={<LoadingPage text="Loading translator..." />}>
                              <CodeTranslator />
                            </Suspense>
                          } />
                          <Route path="practice" element={
                            <Suspense fallback={<LoadingPage text="Loading practice..." />}>
                              <Practice />
                            </Suspense>
                          } />
                          <Route path="achievements" element={
                            <Suspense fallback={<LoadingPage text="Loading achievements..." />}>
                              <Achievements />
                            </Suspense>
                          } />
                          <Route path="profile" element={
                            <Suspense fallback={<LoadingPage text="Loading profile..." />}>
                              <Profile />
                            </Suspense>
                          } />
                          <Route path="settings" element={
                            <Suspense fallback={<LoadingPage text="Loading settings..." />}>
                              <Settings />
                            </Suspense>
                          } />
                          <Route path="components-demo" element={
                            <Suspense fallback={<LoadingPage text="Loading demo..." />}>
                              <ComponentsDemo />
                            </Suspense>
                          } />
                          
                          {/* Tutorial routes */}
                          <Route path="tutorials/:id" element={
                            <Suspense fallback={<LoadingPage text="Loading tutorial..." />}>
                              <TutorialDetail />
                            </Suspense>
                          } />
                          <Route path="tutorials/:id/learn" element={
                            <Suspense fallback={<LoadingPage text="Loading lesson..." />}>
                              <TutorialLearn />
                            </Suspense>
                          } />
                          <Route path="progress" element={<div>Progress Page (Coming Soon)</div>} />
                        </Route>
                        
                        {/* Catch all - redirect to login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                      </Routes>
                      
                      {/* Performance Monitor (Development only) */}
                      <PerformanceMonitorToggle />
                    </div>
                  </SocketProvider>
                </AuthProvider>
              </ToastProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
