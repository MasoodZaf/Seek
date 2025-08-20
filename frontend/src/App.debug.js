import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import Dashboard from './pages/Dashboard';
// import Tutorials from './pages/Tutorials';
// import TutorialDetail from './pages/TutorialDetail';
// import TutorialLearn from './pages/TutorialLearn';
import Playground from './pages/Playground.minimal';
// import CodeTranslator from './pages/CodeTranslator';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Practice from './pages/Practice';
// import Achievements from './pages/Achievements';

// Import components
// import Layout from './components/layout/Layout';
import { LoadingPage } from './components/ui';
// import ErrorBoundary from './components/ErrorBoundary';

// Simplified minimal components to replace complex ones
const MinimalLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="p-4">
      {children}
    </div>
  </div>
);

// Protected Route component WITHOUT context
const ProtectedRoute = ({ children }) => {
  // Simplified - just assume authenticated for now
  return <MinimalLayout>{children}</MinimalLayout>;
};

// Public Route component WITHOUT context
const PublicRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <Router>
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
                <div>Protected Area</div>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/playground" replace />} />
            <Route path="playground" element={<Playground />} />
          </Route>
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;