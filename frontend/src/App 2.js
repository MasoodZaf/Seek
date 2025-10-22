import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import './i18n';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import TutorialLearn from './pages/TutorialLearn';
import PlaygroundNew from './pages/PlaygroundNew';
import CodeTranslator from './pages/CodeTranslator';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Practice from './pages/Practice';
import Achievements from './pages/Achievements';
import ComponentsDemo from './pages/ComponentsDemo';

// Import components
import Layout from './components/layout/Layout';
import { LoadingPage } from './components/ui';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';

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
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ThemeProvider>
              <AuthProvider>
                <SocketProvider>
                <div className="App">
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
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
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="tutorials" element={<Tutorials />} />
                  <Route path="playground" element={<PlaygroundNew />} />
                  <Route path="translator" element={<CodeTranslator />} />
                  <Route path="practice" element={<Practice />} />
                  <Route path="achievements" element={<Achievements />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Tutorial routes */}
                  <Route path="tutorials/:id" element={<TutorialDetail />} />
                  <Route path="tutorials/:id/learn" element={<TutorialLearn />} />
                  <Route path="progress" element={<div>Progress Page (Coming Soon)</div>} />
                </Route>
                
                {/* Catch all - redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
              </div>
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
