/* eslint-disable */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  // Only show loading if a token exists — otherwise land on the landing page immediately
  loading: localStorage.getItem('accessToken') !== null,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload.user, isAuthenticated: true, loading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null };
    case 'AUTH_UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Token management — keeps the shared api instance header in sync
const getStoredToken = () => localStorage.getItem('accessToken');

const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

const setStoredRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

// Restore token on app initialization
const existingToken = getStoredToken();
if (existingToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const syncPreferencesFromDB = (user) => {
    const prefs = user?.preferences || {};
    if (prefs.skillLevel) localStorage.setItem('seek_skill_level', prefs.skillLevel);
    if (prefs.preferredLanguage) localStorage.setItem('seek_preferred_language', prefs.preferredLanguage);
    if (prefs.onboardingDone) localStorage.setItem('seek_onboarding_done', '1');
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // No token stored — skip the API call, just mark as not authenticated
      dispatch({ type: 'AUTH_ERROR', payload: null });
      return;
    }
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await api.get('/auth/profile');
      const user = response.data.data.user;
      syncPreferencesFromDB(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
    } catch (error) {
      if (error.response?.data?.code === 'SESSION_EXPIRED') {
        dispatch({ type: 'AUTH_LOGOUT' });
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: null });
      }
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data.data;

      setStoredToken(tokens.accessToken);
      setStoredRefreshToken(tokens.refreshToken);

      syncPreferencesFromDB(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await api.post('/auth/register', userData);
      const { user, tokens } = response.data.data;

      setStoredToken(tokens.accessToken);
      setStoredRefreshToken(tokens.refreshToken);

      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      toast.success(`Welcome to CodeArc, ${user.firstName}!`);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || [];
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });

      if (errors.length > 0) {
        errors.forEach(err => toast.error(err.message));
      } else {
        toast.error(errorMessage);
      }
      return { success: false, error: errorMessage, errors };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      // Continue with logout even if server call fails
    } finally {
      setStoredToken(null);
      setStoredRefreshToken(null);
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      const updatedUser = response.data.data.user;
      dispatch({ type: 'AUTH_UPDATE_USER', payload: updatedUser });
      toast.success('Profile updated successfully');
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully. Please login again.');
      dispatch({ type: 'AUTH_LOGOUT' });
      setTimeout(() => window.location.reload(), 500);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => dispatch({ type: 'AUTH_CLEAR_ERROR' });

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      loading: true,
      error: 'Context not available',
      login: () => Promise.reject('Context not available'),
      register: () => Promise.reject('Context not available'),
      logout: () => Promise.reject('Context not available'),
      updateUser: () => {},
      clearError: () => {}
    };
  }
  return context;
};

export default AuthContext;
